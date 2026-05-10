class ExploreView {
    constructor() {
        this.allDestinations = [
            { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600', category: 'Cultural', cost: '$$$', country: 'Japan', costIndex: 85, popularity: 92 },
            { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600', category: 'Romantic', cost: '$$$$', country: 'Greece', costIndex: 95, popularity: 97 },
            { name: 'Banff, Canada', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600', category: 'Nature', cost: '$$', country: 'Canada', costIndex: 60, popularity: 78 },
            { name: 'Marrakech, Morocco', image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=600', category: 'Adventure', cost: '$', country: 'Morocco', costIndex: 30, popularity: 85 },
            { name: 'Reykjavik, Iceland', image: 'https://images.unsplash.com/photo-1504829857797-df840fb7e1c8?auto=format&fit=crop&w=600', category: 'Nature', cost: '$$$$', country: 'Iceland', costIndex: 98, popularity: 88 },
            { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600', category: 'Tropical', cost: '$$', country: 'Indonesia', costIndex: 35, popularity: 95 },
            { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600', category: 'Cultural', cost: '$$$', country: 'France', costIndex: 80, popularity: 99 },
            { name: 'Cape Town, South Africa', image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=600', category: 'Adventure', cost: '$$', country: 'South Africa', costIndex: 45, popularity: 82 },
            { name: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600', category: 'Cultural', cost: '$$$', country: 'Italy', costIndex: 75, popularity: 96 },
            { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600', category: 'Luxury', cost: '$$$$', country: 'UAE', costIndex: 90, popularity: 91 },
            { name: 'Bangkok, Thailand', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600', category: 'Adventure', cost: '$', country: 'Thailand', costIndex: 25, popularity: 93 },
            { name: 'New York City, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600', category: 'Urban', cost: '$$$$', country: 'USA', costIndex: 92, popularity: 98 }
        ];
        this.filteredDestinations = this.allDestinations;
    }

    async getHtml() {
        return '<div class="dashboard-header">' +
            '<div>' +
                '<h1>Explore Destinations</h1>' +
                '<p>One-click planning for your next dream journey.</p>' +
            '</div>' +
        '</div>' +

        '<div style="display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap;">' +
            '<input type="text" id="explore-search" class="form-control" placeholder="Search cities, countries..." style="flex: 1; min-width: 200px;">' +
            '<select id="explore-filter" class="form-control" style="width: 180px;">' +
                '<option value="all">All Categories</option>' +
                '<option value="Cultural">Cultural</option>' +
                '<option value="Romantic">Romantic</option>' +
                '<option value="Nature">Nature</option>' +
                '<option value="Adventure">Adventure</option>' +
                '<option value="Tropical">Tropical</option>' +
                '<option value="Luxury">Luxury</option>' +
                '<option value="Urban">Urban</option>' +
            '</select>' +
        '</div>' +

        '<div id="destination-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-bottom: 48px;"></div>' +

        '<div class="card" style="background: var(--gradient-primary); color: white; display: flex; align-items: center; justify-content: space-between; padding: 40px; flex-wrap: wrap; gap: 24px;">' +
            '<div>' +
                '<h2 style="color: white; margin-bottom: 8px;">Feeling Spontaneous?</h2>' +
                '<p style="color: rgba(255,255,255,0.8); margin: 0; max-width: 400px;">Let Traveloop pick a random destination and start your trip immediately!</p>' +
            '</div>' +
            '<button class="btn" id="surprise-me-btn" style="background: white; color: var(--primary-dark);">Surprise Me</button>' +
        '</div>' +

        '<div id="surprise-result" style="display:none; margin-top: 24px;"></div>';
    }

    async createQuickTrip(cityName) {
        try {
            var today = new Date();
            var nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);

            var trip = await api.createTrip({
                name: 'Adventure to ' + cityName,
                description: 'A spontaneous journey to ' + cityName + ' discovered on Traveloop Explore.',
                start_date: today.toISOString().split('T')[0],
                end_date: nextWeek.toISOString().split('T')[0],
                cover_photo: ''
            });

            await api.addStop(trip.tripId, {
                city_name: cityName,
                start_date: today.toISOString().split('T')[0],
                end_date: nextWeek.toISOString().split('T')[0]
            });

            window.location.hash = '#trip/' + trip.tripId;
        } catch (err) {
            alert('Failed to start trip: ' + err.message);
        }
    }

    renderGrid(destinations) {
        var self = this;
        var grid = document.getElementById('destination-grid');
        if (!grid) return;
        
        grid.innerHTML = destinations.map(function(dest) {
            return '<div class="card" style="padding: 0; overflow: hidden; position: relative; cursor: pointer;" onclick="window.exploreViewInstance.createQuickTrip(\'' + dest.name.replace(/'/g, "\\'") + '\')">' +
                '<div style="height: 220px; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%), url(\'' + dest.image + '\') center/cover;"></div>' +
                '<div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; color: white;">' +
                    '<div>' +
                        '<div style="font-size: 0.7rem; text-transform: uppercase; color: var(--primary-light); margin-bottom: 4px; font-weight: 700;">' + dest.category + '</div>' +
                        '<h3 style="margin: 0; color: white;">' + dest.name + '</h3>' +
                    '</div>' +
                '</div>' +
                '<div style="position: absolute; top: 12px; right: 12px;">' +
                    '<button class="btn" style="background: white; color: var(--primary); padding: 6px 12px; font-size: 0.8rem; border-radius: var(--radius-pill); font-weight: 700;">START TRIP</button>' +
                '</div>' +
            '</div>';
        }).join('');
    }

    executeViewScript() {
        var self = this;
        window.exploreViewInstance = this;
        var searchInput = document.getElementById('explore-search');
        var filterSelect = document.getElementById('explore-filter');

        function applyFilters() {
            var query = searchInput.value.toLowerCase();
            var category = filterSelect.value;

            var results = self.allDestinations.filter(function(d) {
                var matchSearch = d.name.toLowerCase().indexOf(query) !== -1 || d.country.toLowerCase().indexOf(query) !== -1;
                var matchCat = category === 'all' || d.category === category;
                return matchSearch && matchCat;
            });
            self.renderGrid(results);
        }

        searchInput.addEventListener('input', applyFilters);
        filterSelect.addEventListener('change', applyFilters);

        applyFilters();

        document.getElementById('surprise-me-btn').addEventListener('click', function() {
            var random = self.allDestinations[Math.floor(Math.random() * self.allDestinations.length)];
            self.createQuickTrip(random.name);
        });
    }
}

window.ExploreView = ExploreView;
