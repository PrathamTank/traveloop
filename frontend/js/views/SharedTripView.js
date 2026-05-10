class SharedTripView {
    constructor(token) {
        this.token = token;
        this.tripData = null;
    }

    async getHtml() {
        try {
            this.tripData = await api.getSharedTrip(this.token);
        } catch (e) {
            console.error(e);
            return '<div class="card" style="text-align:center; padding:60px;">' +
                '<i class="ph ph-warning-circle" style="font-size:48px; color:var(--secondary); margin-bottom:16px;"></i>' +
                '<h2>Shared trip not found</h2>' +
                '<p>This link may have expired or is incorrect.</p>' +
                '<a href="#dashboard" class="btn btn-primary" style="margin-top:24px;">Return Home</a>' +
            '</div>';
        }

        var trip = this.tripData;
        var startDate = new Date(trip.start_date).toLocaleDateString();
        var endDate = new Date(trip.end_date).toLocaleDateString();
        var coverImg = trip.cover_photo || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200';

        var stopsHtml = '';
        if (trip.stops && trip.stops.length > 0) {
            stopsHtml = '<div style="display: flex; flex-direction: column; gap: 16px;">';
            trip.stops.forEach(function(stop) {
                var activitiesHtml = '';
                if (stop.activities && stop.activities.length > 0) {
                    stop.activities.forEach(function(act) {
                        activitiesHtml += '<div style="background: var(--bg-hover); padding: 12px; border-radius: var(--radius-md); display: flex; justify-content: space-between;">' +
                            '<div><strong>' + act.title + '</strong> - ' + (act.category || 'Activity') + '</div>' +
                            '<div>$' + (act.cost || 0) + '</div>' +
                        '</div>';
                    });
                }
                stopsHtml += '<div style="border-left: 4px solid var(--primary); padding-left: 16px; margin-bottom: 16px;">' +
                    '<h3>' + stop.city_name + '</h3>' +
                    '<p style="font-size: 0.875rem;">' + new Date(stop.start_date).toLocaleDateString() + ' - ' + new Date(stop.end_date).toLocaleDateString() + '</p>' +
                    '<div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">' + activitiesHtml + '</div>' +
                '</div>';
            });
            stopsHtml += '</div>';
        }

        return '<div class="card" style="margin-bottom: 24px; background: var(--bg-surface); display: flex; align-items: center; justify-content: space-between; padding: 16px 24px;">' +
            '<div style="display: flex; align-items: center; gap: 12px;">' +
                '<i class="ph ph-globe" style="font-size: 24px; color: var(--primary);"></i>' +
                '<span>You are viewing a shared itinerary by <strong>' + trip.author_name + '</strong></span>' +
            '</div>' +
            '<button class="btn btn-primary" id="copy-shared-trip-btn"><i class="ph ph-copy"></i> Copy to My Trips</button>' +
        '</div>' +

        '<div style="height: 300px; border-radius: var(--radius-lg); margin-bottom: 32px; background: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url(\'' + coverImg + '\') center/cover; color: white; display: flex; flex-direction: column; justify-content: flex-end; padding: 40px;">' +
            '<h1 style="font-size: 3rem; margin-bottom: 8px;">' + trip.name + '</h1>' +
            '<div style="display: flex; gap: 16px; align-items: center; font-size: 1.1rem; opacity: 0.9;">' +
                '<span><i class="ph ph-calendar"></i> ' + startDate + ' - ' + endDate + '</span>' +
            '</div>' +
        '</div>' +

        (trip.description ? '<p style="font-size: 1.1rem; margin-bottom: 32px; max-width: 800px;">' + trip.description + '</p>' : '') +

        '<div class="dashboard-header" style="margin-bottom: 24px;">' +
            '<h2>Itinerary</h2>' +
            '<div style="display: flex; gap: 12px;">' +
                '<button class="btn btn-ghost" id="share-social-btn" style="border: 1px solid var(--border-color);"><i class="ph ph-share-network"></i> Share</button>' +
            '</div>' +
        '</div>' +

        '<div class="card">' + stopsHtml + '</div>';
    }

    executeViewScript() {
        if (!this.tripData) return;
        var self = this;

        document.getElementById('copy-shared-trip-btn').addEventListener('click', async function() {
            if (!localStorage.getItem('traveloop_token')) {
                alert('Please login to copy this trip to your account.');
                window.location.hash = '#login';
                return;
            }
            try {
                var res = await api.copySharedTrip(self.token);
                alert('Trip copied successfully!');
                window.location.hash = '#trip/' + res.tripId;
            } catch (err) {
                alert(err.message);
            }
        });

        document.getElementById('share-social-btn').addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: self.tripData.name + ' - Traveloop',
                    url: window.location.href
                });
            } else {
                alert('Sharing link: ' + window.location.href);
            }
        });
    }
}

window.SharedTripView = SharedTripView;
