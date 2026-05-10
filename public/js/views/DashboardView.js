class DashboardView {
    constructor() {}

    async getHtml() {
        const user = JSON.parse(localStorage.getItem('traveloop_user'));
        let trips = [];
        try {
            trips = await api.getTrips();
        } catch (e) {
            console.error('Failed to load trips', e);
        }

        // Real-time synchronization for upcoming trips
        // Compare dates without time to ensure trips starting today are shown
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingTrips = trips.filter(t => {
            const tripDate = new Date(t.start_date);
            tripDate.setHours(0, 0, 0, 0);
            return tripDate >= today;
        }).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        
        return `
            <div class="dashboard-header">
                <div>
                    <h1>Hello, ${user.name.split(' ')[0]}! 👋</h1>
                    <p>You have ${upcomingTrips.length} upcoming adventures planned.</p>
                </div>
                <div style="display: flex; gap: 12px;">
                    <a href="#tripbuilder" class="btn btn-primary"><i class="ph ph-plus"></i> Plan New Trip</a>
                </div>
            </div>

            <div class="metrics-grid" style="margin-bottom: 40px;">
                <div class="card metric-card">
                    <div class="metric-icon"><i class="ph ph-map-trifold"></i></div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${trips.length}</div>
                        <div style="color: var(--text-secondary); font-size: 0.875rem;">Total Trips</div>
                    </div>
                </div>
                <div class="card metric-card">
                    <div class="metric-icon" style="color: var(--accent); background: rgba(16, 185, 129, 0.1);"><i class="ph ph-airplane-tilt"></i></div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${upcomingTrips.length}</div>
                        <div style="color: var(--text-secondary); font-size: 0.875rem;">Upcoming Trips</div>
                    </div>
                </div>
                <div class="card metric-card">
                    <div class="metric-icon" style="color: var(--secondary); background: rgba(244, 63, 94, 0.1);"><i class="ph ph-calendar-check"></i></div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 700;">${trips.length - upcomingTrips.length}</div>
                        <div style="color: var(--text-secondary); font-size: 0.875rem;">Completed</div>
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h2>Upcoming Itineraries</h2>
                <a href="#trips" style="font-size: 0.875rem; color: var(--primary); font-weight: 600;">View All Trips <i class="ph ph-arrow-right"></i></a>
            </div>

            <div class="trips-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-bottom: 48px;">
                ${upcomingTrips.length === 0 ? `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px; background: var(--bg-surface); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
                        <i class="ph ph-calendar-x" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
                        <h3>No upcoming trips</h3>
                        <p style="margin-bottom: 24px; color: var(--text-secondary);">Your schedule is empty. Ready to fill it with memories?</p>
                        <a href="#explore" class="btn btn-ghost" style="border: 1px solid var(--border-color);">Explore Destinations</a>
                    </div>
                ` : upcomingTrips.map(trip => `
                    <div class="card" style="padding: 0; overflow: hidden; cursor: pointer; transition: transform 0.2s;" onclick="window.location.hash='#trip/${trip.id}'">
                        <div style="height: 160px; background: url('${trip.cover_photo || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600'}') center/cover;"></div>
                        <div style="padding: 20px;">
                            <h3 style="margin-bottom: 8px;">${trip.name}</h3>
                            <div style="color: var(--text-secondary); font-size: 0.875rem; display: flex; gap: 8px; align-items: center;">
                                <i class="ph ph-calendar"></i> ${new Date(trip.start_date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <h2 style="margin-bottom: 24px;">Quick Actions</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <div class="card" style="cursor: pointer;" onclick="window.location.hash='#explore'">
                    <i class="ph ph-compass" style="font-size: 24px; color: var(--primary); margin-bottom: 12px;"></i>
                    <h4>Explore New Places</h4>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">Get inspired for your next big adventure.</p>
                </div>
                <div class="card" style="cursor: pointer;" onclick="window.location.hash='#budget'">
                    <i class="ph ph-coins" style="font-size: 24px; color: var(--accent); margin-bottom: 12px;"></i>
                    <h4>Budget Planner</h4>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">Calculate costs and manage your savings.</p>
                </div>
                <div class="card" style="cursor: pointer;" onclick="window.location.hash='#profile'">
                    <i class="ph ph-user-circle" style="font-size: 24px; color: var(--secondary); margin-bottom: 12px;"></i>
                    <h4>Account Settings</h4>
                    <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">Manage your profile and preferences.</p>
                </div>
            </div>
        `;
    }

    executeViewScript() {}
}

window.DashboardView = DashboardView;
