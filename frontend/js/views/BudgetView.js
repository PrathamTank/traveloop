class BudgetView {
    constructor() {
        this.trips = [];
        this.currentTripData = null;
        this.currentSpent = 0;
        this.mockSuggestions = [
            // PARIS
            { title: 'Eiffel Tower Summit Access', cost: 35, category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=300', locations: ['Paris', 'France'] },
            { title: 'Louvre Museum Masterpieces Tour', cost: 55, category: 'Culture', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300', locations: ['Paris', 'France'] },
            { title: 'Seine River Dinner Cruise', cost: 120, category: 'Food', image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=300', locations: ['Paris', 'France'] },
            { title: 'Palace of Versailles', cost: 45, category: 'History', image: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?w=300', locations: ['Paris', 'France'] },
            { title: 'Montmartre Tour', cost: 25, category: 'Culture', image: 'https://images.unsplash.com/photo-1502602898657-3e907a5ea82c?w=300', locations: ['Paris', 'France'] },
            
            // TOKYO
            { title: 'Shibuya Sky Observatory', cost: 25, category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=300', locations: ['Tokyo', 'Japan'] },
            { title: 'TeamLab Planets', cost: 38, category: 'Experience', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300', locations: ['Tokyo', 'Japan'] },
            { title: 'Robot Restaurant Show', cost: 85, category: 'Entertainment', image: 'https://images.unsplash.com/photo-1552055944-a5b08a22133a?w=300', locations: ['Tokyo', 'Japan'] },
            
            // LONDON
            { title: 'London Eye Ticket', cost: 48, category: 'Sightseeing', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300', locations: ['London', 'UK'] },
            { title: 'Tower of London', cost: 35, category: 'History', image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=300', locations: ['London', 'UK'] },

            // GLOBAL
            { title: 'Local Sim Card', cost: 25, category: 'Utility', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300', locations: ['All'] },
            { title: 'City Transit Pass', cost: 15, category: 'Transport', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300', locations: ['All'] },
            { title: 'Standard Daily Meals', cost: 50, category: 'Food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300', locations: ['All'] },
            { title: 'Airport Shuttle', cost: 40, category: 'Transport', image: 'https://images.unsplash.com/photo-1490650034439-fd184c3c86a5?w=300', locations: ['All'] }
        ];
    }

    async getHtml() {
        try { this.trips = await api.getTrips(); } catch (e) { console.error(e); }
        var options = this.trips.map(function(t) { return '<option value="' + t.id + '">' + t.name + '</option>'; }).join('');

        return '<div class="dashboard-header"><div><h1>Precision Budget Planner</h1><p>Manage trip costs and prevent redundant activity additions.</p></div></div>' +
        '<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 32px;">' +
            '<div class="card" style="height: fit-content;">' +
                '<h3>Settings</h3>' +
                '<div class="form-group" style="margin-top:20px;">' +
                    '<label class="form-label">Trip</label>' +
                    '<select id="budget-trip-select" class="form-control"><option value="" disabled selected>-- Select --</option>' + options + '</select>' +
                '</div>' +
                '<div id="city-select-group" class="form-group" style="margin-top: 16px; display: none;">' +
                    '<label class="form-label">Focus City</label>' +
                    '<select id="budget-city-select" class="form-control"><option value="all">Entire Trip</option></select>' +
                '</div>' +
                '<div class="form-group" style="margin-top: 16px;">' +
                    '<label class="form-label">Budget ($)</label>' +
                    '<input type="number" id="budget-input" class="form-control" value="1500">' +
                '</div>' +
                '<button class="btn btn-primary" id="calculate-budget-btn" style="width: 100%; margin-top: 24px;">Run Analysis</button>' +
            '</div>' +
            '<div>' +
                '<div id="budget-analytics" style="display: none;">' +
                    '<div class="card" style="margin-bottom: 24px; border-left: 6px solid var(--accent);">' +
                        '<div style="display: flex; justify-content: space-between; margin-bottom: 16px;">' +
                            '<div><h3 id="display-trip-name" style="margin:0;"></h3><div id="display-trip-locations" style="font-size: 0.8rem; color: var(--text-muted);"></div></div>' +
                            '<div id="budget-status-tag" style="padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 800; color: white;"></div>' +
                        '</div>' +
                        '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">' +
                            '<div><div style="font-size: 0.75rem; color: var(--text-muted);">TOTAL</div><div id="val-total" style="font-size: 1.5rem; font-weight: 700;"></div></div>' +
                            '<div><div style="font-size: 0.75rem; color: var(--text-muted);">SPENT</div><div id="val-spent" style="font-size: 1.5rem; font-weight: 700; color: var(--secondary);"></div></div>' +
                            '<div><div style="font-size: 0.75rem; color: var(--text-muted);">BALANCE</div><div id="val-remaining" style="font-size: 1.5rem; font-weight: 700; color: var(--accent);"></div></div>' +
                        '</div>' +
                        '<div style="width: 100%; height: 10px; background: #eee; border-radius: 5px; overflow: hidden; margin-bottom: 8px;">' +
                            '<div id="val-progress-bar" style="height:100%; width:0%; background: var(--accent); transition: width 0.6s ease;"></div>' +
                        '</div>' +
                        '<div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600;"><span>Usage Level</span><span id="val-percent-label">0%</span></div>' +
                    '</div>' +
                    '<h3 style="margin-bottom: 16px;">Suggestions</h3>' +
                    '<div id="suggestions-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px;"></div>' +
                '</div>' +
                '<div id="budget-empty-state" style="text-align: center; padding: 100px 0;">' +
                    '<i class="ph ph-hand-coins" style="font-size: 64px; color: #ccc;"></i><h3>Run analysis to see planning options</h3>' +
                '</div>' +
            '</div>' +
        '</div>';
    }

    async handleAddSuggestion(title, cost, category) {
        if (!this.currentTripData) return;
        var citySelect = document.getElementById('budget-city-select');
        var stopId = citySelect.value === 'all' ? this.currentTripData.stops[0].id : citySelect.value;
        try {
            await api.addActivity(this.currentTripData.id, stopId, { title, category, cost, description: 'Added via Budget Planner', duration: '' });
            document.getElementById('calculate-budget-btn').click();
        } catch (err) { alert(err.message); }
    }

    async handleRemoveSuggestion(title) {
        if (!this.currentTripData) return;
        // Find the activity in the trip data
        var activity = null;
        var stopId = null;
        this.currentTripData.stops.forEach(function(s) {
            var found = (s.activities || []).find(function(a) { return a.title === title; });
            if (found) { activity = found; stopId = s.id; }
        });

        if (activity) {
            try {
                await api.deleteActivity(this.currentTripData.id, stopId, activity.id);
                document.getElementById('calculate-budget-btn').click();
            } catch (err) { alert(err.message); }
        }
    }

    executeViewScript() {
        var self = this;
        var tripSelect = document.getElementById('budget-trip-select');
        var citySelect = document.getElementById('budget-city-select');
        var cityGroup = document.getElementById('city-select-group');
        var calculateBtn = document.getElementById('calculate-budget-btn');
        var budgetInput = document.getElementById('budget-input');

        window.budgetViewInstance = this;

        tripSelect.addEventListener('change', async function() {
            var tripId = tripSelect.value;
            try {
                var trip = await api.getTripDetails(tripId);
                self.currentTripData = trip;
                cityGroup.style.display = 'block';
                citySelect.innerHTML = '<option value="all">Entire Trip</option>' + 
                    (trip.stops || []).map(function(s) { return '<option value="' + s.id + '" data-name="' + s.city_name + '">' + s.city_name + '</option>'; }).join('');
            } catch (e) { console.error(e); }
        });

        calculateBtn.addEventListener('click', async function() {
            var tripId = tripSelect.value;
            if (!tripId) { alert("Select a trip."); return; }
            calculateBtn.disabled = true; calculateBtn.textContent = 'Analyzing...';

            try {
                var trip = await api.getTripDetails(tripId);
                self.currentTripData = trip;
                self.currentSpent = 0;
                var tripLocs = [];
                var existingTitles = [];

                if (trip.stops) {
                    trip.stops.forEach(function(s) {
                        tripLocs.push(s.city_name);
                        if (s.activities) {
                            s.activities.forEach(function(a) { 
                                self.currentSpent += (parseFloat(a.cost) || 0); 
                                existingTitles.push(a.title);
                            });
                        }
                    });
                }

                var totalBudget = parseFloat(budgetInput.value) || 0;
                var remaining = totalBudget - self.currentSpent;
                var percent = totalBudget > 0 ? (self.currentSpent / totalBudget) * 100 : 0;

                document.getElementById('budget-empty-state').style.display = 'none';
                document.getElementById('budget-analytics').style.display = 'block';
                document.getElementById('display-trip-name').textContent = trip.name;
                document.getElementById('display-trip-locations').textContent = tripLocs.filter((v,i,a)=>a.indexOf(v)===i).join(' • ');

                document.getElementById('val-total').textContent = '$' + totalBudget.toFixed(2);
                document.getElementById('val-spent').textContent = '$' + self.currentSpent.toFixed(2);
                document.getElementById('val-remaining').textContent = '$' + remaining.toFixed(2);
                document.getElementById('val-progress-bar').style.width = Math.min(percent, 100) + '%';
                document.getElementById('val-percent-label').textContent = percent.toFixed(1) + '%';

                var tag = document.getElementById('budget-status-tag');
                tag.textContent = percent > 100 ? 'OVER' : (percent > 85 ? 'NEAR' : 'OK');
                tag.style.background = percent > 100 ? 'var(--secondary)' : (percent > 85 ? '#F59E0B' : 'var(--accent)');

                var selectedOption = citySelect.options[citySelect.selectedIndex];
                var focusCity = citySelect.value === 'all' ? '' : selectedOption.dataset.name.toLowerCase();

                var suggestions = self.mockSuggestions.filter(function(s) {
                    if (focusCity) return focusCity.indexOf(s.locations[0].toLowerCase()) !== -1 || s.locations[0].toLowerCase().indexOf(focusCity) !== -1 || s.locations[0] === 'All';
                    return s.locations.some(function(l) { return l === 'All' || tripLocs.some(function(tl) { return tl.toLowerCase().indexOf(l.toLowerCase()) !== -1; }); });
                });

                // Ensure 8 items
                if (suggestions.length < 8) {
                    var globals = self.mockSuggestions.filter(function(s) { return s.locations[0] === 'All'; });
                    for (var g of globals) {
                        if (suggestions.length >= 8) break;
                        if (!suggestions.includes(g)) suggestions.push(g);
                    }
                }

                document.getElementById('suggestions-container').innerHTML = suggestions.map(function(s) {
                    var exists = existingTitles.includes(s.title);
                    return '<div class="card" style="padding: 0; overflow: hidden; border: 1px solid #ddd; display:flex; flex-direction:column;">' +
                        '<div style="height: 90px; background: url(\'' + s.image + '\') center/cover;"></div>' +
                        '<div style="padding: 12px; flex-grow:1;">' +
                            '<div style="font-size: 0.6rem; color: var(--primary); font-weight: 800;">' + s.category.toUpperCase() + '</div>' +
                            '<h4 style="margin: 4px 0 10px; font-size: 0.85rem; height: 34px; overflow: hidden;">' + s.title + '</h4>' +
                            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                                '<div style="font-weight: 800; font-size: 1rem;">$' + s.cost + '</div>' +
                                (exists ? 
                                    '<button class="btn btn-ghost" style="padding: 4px 10px; font-size: 0.7rem; color: var(--secondary); border: 1px solid var(--secondary);" ' +
                                    'onclick="window.budgetViewInstance.handleRemoveSuggestion(\'' + s.title.replace(/'/g, "\\'") + '\')">REMOVE</button>' :
                                    '<button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.7rem;" ' +
                                    'onclick="window.budgetViewInstance.handleAddSuggestion(\'' + s.title.replace(/'/g, "\\'") + '\', ' + s.cost + ', \'' + s.category + '\')">ADD</button>'
                                ) +
                            '</div>' +
                        '</div>' +
                    '</div>';
                }).join('');

            } catch (err) { console.error(err); alert("Error."); } finally {
                calculateBtn.disabled = false; calculateBtn.textContent = 'Run Analysis';
            }
        });
    }
}

window.BudgetView = BudgetView;
