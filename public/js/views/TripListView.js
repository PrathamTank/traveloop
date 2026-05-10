class TripListView {
    constructor() {}

    async getHtml() {
        let trips = [];
        try {
            trips = await api.getTrips();
        } catch (e) {
            console.error('Failed to load trips', e);
        }

        return `
            <div class="dashboard-header">
                <div>
                    <h1>My Trips</h1>
                    <p>All your travel adventures in one place.</p>
                </div>
                <a href="#tripbuilder" class="btn btn-primary"><i class="ph ph-plus"></i> New Trip</a>
            </div>

            <div class="trips-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
                ${trips.length === 0 ? `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
                        <i class="ph ph-map-trifold" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
                        <h3>No trips found</h3>
                        <p style="margin-bottom: 24px;">You haven't planned any trips yet.</p>
                        <a href="#tripbuilder" class="btn btn-primary">Start Planning</a>
                    </div>
                ` : trips.map(trip => `
                    <div class="card trip-card" style="padding: 0; overflow: hidden; cursor: pointer; display: flex; flex-direction: column; position: relative;" onclick="window.location.hash='#trip/${trip.id}'">
                        <button class="delete-trip-btn" data-id="${trip.id}" style="position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: var(--secondary); cursor: pointer; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <i class="ph ph-trash"></i>
                        </button>
                        <div style="height: 180px; background: url('${trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600'}') center/cover;"></div>
                        <div style="padding: 24px; flex: 1; display: flex; flex-direction: column;">
                            <h3 style="margin-bottom: 8px;">${trip.name}</h3>
                            <p style="font-size: 0.875rem; flex: 1; color: var(--text-secondary);">${trip.description || 'No description provided.'}</p>
                            <div style="color: var(--text-muted); font-size: 0.875rem; display: flex; gap: 8px; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                                <i class="ph ph-calendar"></i> ${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    executeViewScript() {
        document.querySelectorAll('.delete-trip-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this trip and all its contents? This cannot be undone.')) {
                    try {
                        await api.deleteTrip(btn.dataset.id);
                        window.appRouter.handleRoute();
                    } catch (err) {
                        alert('Failed to delete trip: ' + err.message);
                    }
                }
            });
        });
    }
}

window.TripListView = TripListView;
