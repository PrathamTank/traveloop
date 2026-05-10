const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Import Routes
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const uploadRoutes = require('./routes/uploads');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/uploads', uploadRoutes);

// Fallback for SPA routing - serve index.html for unknown paths (if history API used instead of hash)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
