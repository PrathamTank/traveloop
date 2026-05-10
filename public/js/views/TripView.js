class TripView {
    constructor(tripId) {
        this.tripId = tripId;
        this.tripData = null;
    }

    async getHtml() {
        try {
            this.tripData = await api.getTripDetails(this.tripId);
        } catch (e) {
            console.error(e);
            return '<div class="card"><h2 style="color:var(--secondary)">Trip not found</h2></div>';
        }

        var trip = this.tripData;
        var startDate = new Date(trip.start_date).toLocaleDateString();
        var endDate = new Date(trip.end_date).toLocaleDateString();
        var coverImg = trip.cover_photo || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200';

        // Build stops HTML
        var stopsHtml = '';
        if (trip.stops && trip.stops.length > 0) {
            stopsHtml = '<div style="display: flex; flex-direction: column; gap: 16px;">';
            trip.stops.forEach(function(stop) {
                var activitiesHtml = '';
                if (stop.activities && stop.activities.length > 0) {
                    stop.activities.forEach(function(act) {
                        activitiesHtml += '<div style="background: var(--bg-hover); padding: 12px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">' +
                            '<div><strong>' + act.title + '</strong> - ' + (act.category || 'Activity') + ' ($' + (act.cost || 0) + ')</div>' +
                            '<button class="btn btn-ghost delete-activity-btn" data-activity-id="' + act.id + '" data-stop-id="' + stop.id + '" style="padding: 4px 8px; color: var(--secondary);"><i class="ph ph-trash"></i></button>' +
                        '</div>';
                    });
                } else {
                    activitiesHtml = '<p style="color: var(--text-muted); font-size: 0.875rem;">No activities planned yet.</p>';
                }
                stopsHtml += '<div style="border-left: 4px solid var(--primary); padding-left: 16px; margin-bottom: 24px;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                        '<h3>' + stop.city_name + '</h3>' +
                        '<button class="btn btn-ghost delete-stop-btn" data-stop-id="' + stop.id + '" style="padding: 4px 8px; color: var(--secondary);"><i class="ph ph-trash"></i> Delete Stop</button>' +
                    '</div>' +
                    '<p style="font-size: 0.875rem;">' + new Date(stop.start_date).toLocaleDateString() + ' - ' + new Date(stop.end_date).toLocaleDateString() + '</p>' +
                    '<div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">' + activitiesHtml + '</div>' +
                    '<button class="btn btn-ghost open-activity-modal" data-stop-id="' + stop.id + '" style="margin-top: 12px; padding: 8px 12px; font-size: 0.875rem; border: 1px solid var(--border-color);"><i class="ph ph-plus"></i> Add Activity</button>' +
                '</div>';
            });
            stopsHtml += '</div>';
        } else {
            stopsHtml = '<div style="text-align: center; padding: 40px;">' +
                '<i class="ph ph-map-pin" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>' +
                '<p>No stops added to this trip yet.</p>' +
            '</div>';
        }

        // Build notes HTML
        var notesHtml = '';
        if (trip.notes && trip.notes.length > 0) {
            trip.notes.forEach(function(note) {
                notesHtml += '<div style="background: var(--bg-hover); padding: 16px; border-radius: var(--radius-md); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-start;">' +
                    '<div>' +
                        '<p style="margin: 0;">' + note.content + '</p>' +
                        '<small style="color: var(--text-muted);">' + new Date(note.created_at).toLocaleString() + '</small>' +
                    '</div>' +
                    '<button class="btn btn-ghost delete-note-btn" data-note-id="' + note.id + '" style="padding: 4px 8px; color: var(--secondary);"><i class="ph ph-trash"></i></button>' +
                '</div>';
            });
        } else {
            notesHtml = '<p style="color: var(--text-muted); font-size: 0.875rem;">No notes yet.</p>';
        }

        // City datalist options
        var cityOptions = ['Tokyo, Japan','Kyoto, Japan','Osaka, Japan','Seoul, South Korea','Busan, South Korea',
            'Beijing, China','Shanghai, China','Hong Kong, China','Bangkok, Thailand','Chiang Mai, Thailand',
            'Phuket, Thailand','Singapore','Kuala Lumpur, Malaysia','Bali, Indonesia','Jakarta, Indonesia',
            'Hanoi, Vietnam','Ho Chi Minh City, Vietnam','Manila, Philippines','Mumbai, India','New Delhi, India',
            'Jaipur, India','Goa, India','Colombo, Sri Lanka','Kathmandu, Nepal','Taipei, Taiwan',
            'Paris, France','Nice, France','Lyon, France','London, UK','Edinburgh, UK',
            'Rome, Italy','Florence, Italy','Venice, Italy','Milan, Italy','Amalfi Coast, Italy',
            'Barcelona, Spain','Madrid, Spain','Seville, Spain','Berlin, Germany','Munich, Germany',
            'Amsterdam, Netherlands','Prague, Czech Republic','Vienna, Austria','Salzburg, Austria',
            'Zurich, Switzerland','Interlaken, Switzerland','Lisbon, Portugal','Porto, Portugal',
            'Athens, Greece','Santorini, Greece','Mykonos, Greece','Istanbul, Turkey','Cappadocia, Turkey',
            'Budapest, Hungary','Dubrovnik, Croatia','Split, Croatia','Warsaw, Poland','Krakow, Poland',
            'Stockholm, Sweden','Copenhagen, Denmark','Oslo, Norway','Helsinki, Finland','Reykjavik, Iceland',
            'Dublin, Ireland','Brussels, Belgium','Bruges, Belgium','Bucharest, Romania','Sofia, Bulgaria',
            'Moscow, Russia','St. Petersburg, Russia','New York City, USA','Los Angeles, USA',
            'San Francisco, USA','Miami, USA','Chicago, USA','Las Vegas, USA','Honolulu, USA',
            'New Orleans, USA','Washington D.C., USA','Boston, USA','Seattle, USA','Austin, USA',
            'Nashville, USA','Toronto, Canada','Vancouver, Canada','Montreal, Canada','Banff, Canada',
            'Mexico City, Mexico','Cancun, Mexico','Havana, Cuba','Buenos Aires, Argentina',
            'Rio de Janeiro, Brazil','Sao Paulo, Brazil','Lima, Peru','Cusco, Peru',
            'Bogota, Colombia','Medellin, Colombia','Cartagena, Colombia','Santiago, Chile',
            'Cape Town, South Africa','Johannesburg, South Africa','Marrakech, Morocco','Fez, Morocco',
            'Cairo, Egypt','Luxor, Egypt','Nairobi, Kenya','Zanzibar, Tanzania','Accra, Ghana',
            'Lagos, Nigeria','Dubai, UAE','Abu Dhabi, UAE','Doha, Qatar','Amman, Jordan',
            'Petra, Jordan','Tel Aviv, Israel','Jerusalem, Israel','Sydney, Australia','Melbourne, Australia',
            'Brisbane, Australia','Perth, Australia','Auckland, New Zealand','Queenstown, New Zealand',
            'Fiji','Bora Bora, French Polynesia','Nassau, Bahamas','Montego Bay, Jamaica',
            'Punta Cana, Dominican Republic','Aruba','Barbados','St. Lucia'];
        var datalistHtml = cityOptions.map(function(c) { return '<option value="' + c + '"></option>'; }).join('');

        return '<div style="height: 300px; border-radius: var(--radius-lg); margin-bottom: 32px; background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(\'' + coverImg + '\') center/cover; color: white; display: flex; flex-direction: column; justify-content: flex-end; padding: 40px;">' +
            '<h1 style="font-size: 3rem; margin-bottom: 8px;">' + trip.name + '</h1>' +
            '<div style="display: flex; gap: 16px; align-items: center; font-size: 1.1rem; opacity: 0.9;">' +
                '<span><i class="ph ph-calendar"></i> ' + startDate + ' - ' + endDate + '</span>' +
            '</div>' +
        '</div>' +

        (trip.description ? '<p style="font-size: 1.1rem; margin-bottom: 32px; max-width: 800px;">' + trip.description + '</p>' : '') +

        '<div class="dashboard-header" style="margin-bottom: 24px;">' +
            '<h2>Itinerary Details</h2>' +
            '<div style="display: flex; gap: 12px; flex-wrap: wrap;">' +
                '<button class="btn btn-primary" id="open-stop-modal"><i class="ph ph-plus"></i> Add Stop</button>' +
                '<button class="btn" id="open-note-modal" style="background: var(--accent); color: white;"><i class="ph ph-note-pencil"></i> Add Note</button>' +
                '<a href="#packing/' + this.tripId + '" class="btn btn-ghost" style="border: 1px solid var(--border-color);"><i class="ph ph-backpack"></i> Packing List</a>' +
                '<button class="btn btn-ghost" id="share-trip-btn" style="border: 1px solid var(--border-color);"><i class="ph ph-share-network"></i> Share</button>' +
            '</div>' +
        '</div>' +

        '<div class="card" id="stops-container">' + stopsHtml + '</div>' +

        '<h2 style="margin-top: 40px; margin-bottom: 16px;">Trip Notes</h2>' +
        '<div class="card" id="notes-container">' + notesHtml + '</div>' +

        // Modals
        // Stop Modal
        '<div id="stop-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center;">' +
            '<div class="card" style="width: 100%; max-width: 500px;">' +
                '<h3 style="margin-bottom: 16px;">Add a Stop</h3>' +
                '<form id="add-stop-form">' +
                    '<div class="form-group">' +
                        '<label class="form-label">City Name</label>' +
                        '<input type="text" id="stop-city" class="form-control" list="city-list" placeholder="Type or select a city..." required autocomplete="off">' +
                        '<datalist id="city-list">' + datalistHtml + '</datalist>' +
                    '</div>' +
                    '<div style="display:flex; gap:16px;">' +
                        '<div class="form-group" style="flex:1;">' +
                            '<label class="form-label">Start Date</label>' +
                            '<input type="date" id="stop-start" class="form-control" required>' +
                        '</div>' +
                        '<div class="form-group" style="flex:1;">' +
                            '<label class="form-label">End Date</label>' +
                            '<input type="date" id="stop-end" class="form-control" required>' +
                        '</div>' +
                    '</div>' +
                    '<div style="display:flex; justify-content:flex-end; gap:16px; margin-top:16px;">' +
                        '<button type="button" class="btn btn-ghost close-modal">Cancel</button>' +
                        '<button type="submit" class="btn btn-primary" id="save-stop-btn">Save Stop</button>' +
                    '</div>' +
                '</form>' +
            '</div>' +
        '</div>' +

        // Activity Modal
        '<div id="activity-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center;">' +
            '<div class="card" style="width: 100%; max-width: 500px;">' +
                '<h3 style="margin-bottom: 16px;">Add an Activity</h3>' +
                '<form id="add-activity-form">' +
                    '<input type="hidden" id="activity-stop-id">' +
                    '<div class="form-group">' +
                        '<label class="form-label">Activity Title</label>' +
                        '<input type="text" id="activity-title" class="form-control" required>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Category</label>' +
                        '<select id="activity-category" class="form-control">' +
                            '<option>Sightseeing</option><option>Food &amp; Drink</option><option>Transport</option><option>Accommodation</option><option>Shopping</option><option>Nightlife</option><option>Other</option>' +
                        '</select>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Estimated Cost ($)</label>' +
                        '<input type="number" id="activity-cost" class="form-control" value="0">' +
                    '</div>' +
                    '<div style="display:flex; justify-content:flex-end; gap:16px; margin-top:16px;">' +
                        '<button type="button" class="btn btn-ghost close-modal">Cancel</button>' +
                        '<button type="submit" class="btn btn-primary" id="save-activity-btn">Save Activity</button>' +
                    '</div>' +
                '</form>' +
            '</div>' +
        '</div>' +

        // Note Modal
        '<div id="note-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center;">' +
            '<div class="card" style="width: 100%; max-width: 500px;">' +
                '<h3 style="margin-bottom: 16px;">Add a Note</h3>' +
                '<form id="add-note-form">' +
                    '<div class="form-group">' +
                        '<label class="form-label">Note Content</label>' +
                        '<textarea id="note-content" class="form-control" rows="4" placeholder="Hotel check-in info, reminders, contacts..." required></textarea>' +
                    '</div>' +
                    '<div style="display:flex; justify-content:flex-end; gap:16px; margin-top:16px;">' +
                        '<button type="button" class="btn btn-ghost close-modal">Cancel</button>' +
                        '<button type="submit" class="btn btn-primary" id="save-note-btn">Save Note</button>' +
                    '</div>' +
                '</form>' +
            '</div>' +
        '</div>' +

        // Share Modal
        '<div id="share-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center;">' +
            '<div class="card" style="width: 100%; max-width: 500px; text-align: center;">' +
                '<h3 style="margin-bottom: 16px;">Share This Trip</h3>' +
                '<p style="margin-bottom: 16px;">Your trip is now public! Share this link:</p>' +
                '<input type="text" id="share-url" class="form-control" readonly style="text-align: center; margin-bottom: 16px;">' +
                '<div style="display:flex; gap:12px; justify-content: center; flex-wrap: wrap;">' +
                    '<button class="btn btn-primary" id="copy-share-url"><i class="ph ph-copy"></i> Copy Link</button>' +
                    '<button class="btn btn-ghost close-modal" style="border: 1px solid var(--border-color);">Close</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    executeViewScript() {
        if (!this.tripData) return;
        var self = this;

        var stopModal = document.getElementById('stop-modal');
        var activityModal = document.getElementById('activity-modal');
        var noteModal = document.getElementById('note-modal');
        var shareModal = document.getElementById('share-modal');

        // Open Modals
        document.getElementById('open-stop-modal').addEventListener('click', function() { stopModal.style.display = 'flex'; });
        document.getElementById('open-note-modal').addEventListener('click', function() { noteModal.style.display = 'flex'; });

        document.querySelectorAll('.open-activity-modal').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                document.getElementById('activity-stop-id').value = e.target.closest('button').dataset.stopId;
                activityModal.style.display = 'flex';
            });
        });

        // Close Modals
        document.querySelectorAll('.close-modal').forEach(function(btn) {
            btn.addEventListener('click', function() {
                stopModal.style.display = 'none';
                activityModal.style.display = 'none';
                noteModal.style.display = 'none';
                shareModal.style.display = 'none';
            });
        });

        // Submit Stop
        document.getElementById('add-stop-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            var btn = document.getElementById('save-stop-btn');
            btn.disabled = true; btn.textContent = 'Saving...';
            try {
                await api.addStop(self.tripId, {
                    city_name: document.getElementById('stop-city').value,
                    start_date: document.getElementById('stop-start').value,
                    end_date: document.getElementById('stop-end').value
                });
                stopModal.style.display = 'none';
                window.appRouter.handleRoute();
            } catch (err) { alert(err.message); btn.disabled = false; btn.textContent = 'Save Stop'; }
        });

        // Delete Stop
        document.querySelectorAll('.delete-stop-btn').forEach(function(btn) {
            btn.addEventListener('click', async function() {
                if (confirm('Delete this stop and ALL its activities?')) {
                    try {
                        await api.deleteStop(self.tripId, btn.dataset.stopId);
                        window.appRouter.handleRoute();
                    } catch (err) { alert(err.message); }
                }
            });
        });

        // Submit Activity
        document.getElementById('add-activity-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            var btn = document.getElementById('save-activity-btn');
            btn.disabled = true; btn.textContent = 'Saving...';
            var stopId = document.getElementById('activity-stop-id').value;
            try {
                await api.addActivity(self.tripId, stopId, {
                    title: document.getElementById('activity-title').value,
                    category: document.getElementById('activity-category').value,
                    cost: document.getElementById('activity-cost').value,
                    description: '', duration: ''
                });
                activityModal.style.display = 'none';
                window.appRouter.handleRoute();
            } catch (err) { alert(err.message); btn.disabled = false; btn.textContent = 'Save Activity'; }
        });

        // Delete Activity
        document.querySelectorAll('.delete-activity-btn').forEach(function(btn) {
            btn.addEventListener('click', async function() {
                if (confirm('Delete this activity?')) {
                    try {
                        await api.deleteActivity(self.tripId, btn.dataset.stopId, btn.dataset.activityId);
                        window.appRouter.handleRoute();
                    } catch (err) { alert(err.message); }
                }
            });
        });

        // Submit Note
        document.getElementById('add-note-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            var btn = document.getElementById('save-note-btn');
            btn.disabled = true; btn.textContent = 'Saving...';
            try {
                await api.addNote(self.tripId, document.getElementById('note-content').value);
                noteModal.style.display = 'none';
                window.appRouter.handleRoute();
            } catch (err) { alert(err.message); btn.disabled = false; btn.textContent = 'Save Note'; }
        });

        // Delete Note
        document.querySelectorAll('.delete-note-btn').forEach(function(btn) {
            btn.addEventListener('click', async function() {
                if (confirm('Delete this note?')) {
                    await api.deleteNote(self.tripId, btn.dataset.noteId);
                    window.appRouter.handleRoute();
                }
            });
        });

        // Share Trip
        document.getElementById('share-trip-btn').addEventListener('click', async function() {
            try {
                var data = await api.shareTrip(self.tripId);
                var url = window.location.origin + '/#shared/' + data.shareToken;
                document.getElementById('share-url').value = url;
                shareModal.style.display = 'flex';
            } catch (err) { alert(err.message); }
        });

        // Copy Share URL
        document.getElementById('copy-share-url').addEventListener('click', function() {
            var input = document.getElementById('share-url');
            input.select();
            document.execCommand('copy');
            this.textContent = 'Copied!';
            setTimeout(function() { document.getElementById('copy-share-url').innerHTML = '<i class="ph ph-copy"></i> Copy Link'; }, 2000);
        });
    }
}

window.TripView = TripView;
