const express = require('express');
const crypto = require('crypto');
const db = require('../db/database');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret_key_traveloop_2026';

// Middleware to authenticate
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied, token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// GET all trips for logged in user
router.get('/', authenticate, (req, res) => {
    db.all('SELECT * FROM trips WHERE user_id = ? ORDER BY start_date ASC', [req.user.userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// GET specific trip details (includes stops, activities, notes, packing)
router.get('/:id', authenticate, (req, res) => {
    db.get('SELECT * FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId], (err, trip) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        db.all('SELECT * FROM stops WHERE trip_id = ? ORDER BY position_order ASC', [trip.id], (err, stops) => {
            if (err) return res.status(500).json({ error: 'Database error fetching stops' });

            db.all('SELECT * FROM notes WHERE trip_id = ? ORDER BY created_at DESC', [trip.id], (err, notes) => {
                if (err) notes = [];
                trip.notes = notes || [];

                db.all('SELECT * FROM packing_items WHERE trip_id = ?', [trip.id], (err, packingItems) => {
                    if (err) packingItems = [];
                    trip.packing_items = packingItems || [];

                    if (stops.length === 0) {
                        trip.stops = [];
                        return res.json(trip);
                    }

                    var stopIds = stops.map(function(s) { return s.id; });
                    var placeholders = stopIds.map(function() { return '?'; }).join(',');

                    db.all('SELECT * FROM activities WHERE stop_id IN (' + placeholders + ')', stopIds, (err, activities) => {
                        if (err) return res.status(500).json({ error: 'Database error fetching activities' });

                        stops.forEach(function(stop) {
                            stop.activities = activities.filter(function(a) { return a.stop_id === stop.id; });
                        });
                        trip.stops = stops;
                        res.json(trip);
                    });
                });
            });
        });
    });
});

// POST new trip
router.post('/', authenticate, (req, res) => {
    var { name, description, start_date, end_date, cover_photo } = req.body;
    db.run(
        'INSERT INTO trips (user_id, name, description, start_date, end_date, cover_photo) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.userId, name, description, start_date, end_date, cover_photo],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ message: 'Trip created', tripId: this.lastID });
        }
    );
});

// DELETE trip
router.delete('/:id', authenticate, (req, res) => {
    db.run('DELETE FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Trip deleted successfully' });
    });
});

// POST new stop to a trip
router.post('/:id/stops', authenticate, (req, res) => {
    var tripId = req.params.id;
    var { city_name, start_date, end_date } = req.body;

    db.get('SELECT id FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.userId], (err, trip) => {
        if (err || !trip) return res.status(404).json({ error: 'Trip not found or unauthorized' });

        db.get('SELECT MAX(position_order) as maxPos FROM stops WHERE trip_id = ?', [tripId], (err, row) => {
            var nextPos = (row && row.maxPos !== null) ? row.maxPos + 1 : 1;

            db.run(
                'INSERT INTO stops (trip_id, city_name, start_date, end_date, position_order) VALUES (?, ?, ?, ?, ?)',
                [tripId, city_name, start_date, end_date, nextPos],
                function(err) {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    res.status(201).json({ message: 'Stop added', stopId: this.lastID });
                }
            );
        });
    });
});

// DELETE stop
router.delete('/:id/stops/:stopId', authenticate, (req, res) => {
    db.run('DELETE FROM stops WHERE id = ? AND trip_id = ?', [req.params.stopId, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Stop deleted successfully' });
    });
});

// POST new activity to a stop
router.post('/:id/stops/:stopId/activities', authenticate, (req, res) => {
    var stopId = req.params.stopId;
    var { title, description, cost, duration, category } = req.body;

    db.run(
        'INSERT INTO activities (stop_id, title, description, cost, duration, category) VALUES (?, ?, ?, ?, ?, ?)',
        [stopId, title, description, cost, duration, category],
        function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ message: 'Activity added', activityId: this.lastID });
        }
    );
});

// DELETE activity
router.delete('/:id/stops/:stopId/activities/:activityId', authenticate, (req, res) => {
    db.run('DELETE FROM activities WHERE id = ? AND stop_id = ?', [req.params.activityId, req.params.stopId], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Activity deleted' });
    });
});

// ========== NOTES ==========
// POST note to a trip
router.post('/:id/notes', authenticate, (req, res) => {
    var tripId = req.params.id;
    var { content } = req.body;

    db.get('SELECT id FROM trips WHERE id = ? AND user_id = ?', [tripId, req.user.userId], (err, trip) => {
        if (err || !trip) return res.status(404).json({ error: 'Trip not found' });

        db.run('INSERT INTO notes (trip_id, content) VALUES (?, ?)', [tripId, content], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ message: 'Note added', noteId: this.lastID });
        });
    });
});

// DELETE note
router.delete('/:id/notes/:noteId', authenticate, (req, res) => {
    db.run('DELETE FROM notes WHERE id = ?', [req.params.noteId], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Note deleted' });
    });
});

// ========== PACKING ITEMS ==========
// POST packing item
router.post('/:id/packing', authenticate, (req, res) => {
    var tripId = req.params.id;
    var { category, item_name } = req.body;

    db.run('INSERT INTO packing_items (trip_id, category, item_name) VALUES (?, ?, ?)',
        [tripId, category, item_name], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json({ message: 'Item added', itemId: this.lastID });
        });
});

// PUT toggle packing item
router.put('/:id/packing/:itemId', authenticate, (req, res) => {
    var { is_packed } = req.body;
    db.run('UPDATE packing_items SET is_packed = ? WHERE id = ?', [is_packed, req.params.itemId], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Item updated' });
    });
});

// DELETE packing item
router.delete('/:id/packing/:itemId', authenticate, (req, res) => {
    db.run('DELETE FROM packing_items WHERE id = ?', [req.params.itemId], function(err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'Item deleted' });
    });
});

// ========== SHARING ==========
// POST share trip (generate public token)
router.post('/:id/share', authenticate, (req, res) => {
    var tripId = req.params.id;
    var shareToken = crypto.randomBytes(16).toString('hex');

    db.run('UPDATE trips SET is_public = 1, share_token = ? WHERE id = ? AND user_id = ?',
        [shareToken, tripId, req.user.userId], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Trip shared', shareToken: shareToken });
        });
});

// GET public shared trip (no auth needed)
router.get('/shared/:token', (req, res) => {
    db.get('SELECT * FROM trips WHERE share_token = ? AND is_public = 1', [req.params.token], (err, trip) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!trip) return res.status(404).json({ error: 'Shared trip not found' });

        // Get the user name
        db.get('SELECT name FROM users WHERE id = ?', [trip.user_id], (err, user) => {
            trip.author_name = user ? user.name : 'Anonymous';

            db.all('SELECT * FROM stops WHERE trip_id = ? ORDER BY position_order ASC', [trip.id], (err, stops) => {
                if (err) stops = [];
                if (!stops || stops.length === 0) {
                    trip.stops = [];
                    return res.json(trip);
                }

                var stopIds = stops.map(function(s) { return s.id; });
                var placeholders = stopIds.map(function() { return '?'; }).join(',');

                db.all('SELECT * FROM activities WHERE stop_id IN (' + placeholders + ')', stopIds, (err, activities) => {
                    if (err) activities = [];
                    stops.forEach(function(stop) {
                        stop.activities = (activities || []).filter(function(a) { return a.stop_id === stop.id; });
                    });
                    trip.stops = stops;
                    res.json(trip);
                });
            });
        });
    });
});

// POST copy a shared trip to user's account
router.post('/shared/:token/copy', authenticate, (req, res) => {
    db.get('SELECT * FROM trips WHERE share_token = ? AND is_public = 1', [req.params.token], (err, original) => {
        if (err || !original) return res.status(404).json({ error: 'Shared trip not found' });

        db.run('INSERT INTO trips (user_id, name, description, start_date, end_date, cover_photo) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.userId, original.name + ' (Copy)', original.description, original.start_date, original.end_date, original.cover_photo],
            function(err) {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.status(201).json({ message: 'Trip copied', tripId: this.lastID });
            }
        );
    });
});

module.exports = router;
