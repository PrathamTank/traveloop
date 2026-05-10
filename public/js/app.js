class Router {
    constructor() {
        this.routes = {};
        this.appContent = document.getElementById('app-content');
        this.sidebar = document.getElementById('sidebar');
    }

    addRoute(path, view) {
        this.routes[path] = view;
    }

    async handleRoute() {
        var hash = window.location.hash || '#dashboard';
        var parts = hash.split('/');
        var path = parts[0];
        var param = parts[1];

        // Auth Check
        var publicRoutes = ['#login', '#register', '#shared'];
        var isPublic = false;
        for (var p of publicRoutes) {
            if (path === p) isPublic = true;
        }

        if (!isPublic && !localStorage.getItem('traveloop_token')) {
            window.location.hash = '#login';
            return;
        }

        // Sidebar Visibility
        if (path === '#login' || path === '#register') {
            this.sidebar.style.display = 'none';
        } else {
            this.sidebar.style.display = 'flex';
            this.updateActiveNav(path);
        }

        var ViewClass = this.routes[path];
        if (ViewClass) {
            // Show loader
            this.appContent.innerHTML = '<div class="loader-container"><div class="spinner"></div></div>';
            
            var view = new ViewClass(param);
            var html = await view.getHtml();
            this.appContent.innerHTML = '<div class="fade-in">' + html + '</div>';
            
            if (view.executeViewScript) {
                view.executeViewScript();
            }
            window.scrollTo(0,0);
        } else {
            this.appContent.innerHTML = '<h1>404 Not Found</h1>';
        }
    }

    updateActiveNav(path) {
        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    }

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        
        this.addRoute('#login', window.LoginView);
        this.addRoute('#register', window.LoginView);
        this.addRoute('#dashboard', window.DashboardView);
        this.addRoute('#trips', window.TripListView);
        this.addRoute('#tripbuilder', window.TripBuilderView);
        this.addRoute('#explore', window.ExploreView);
        this.addRoute('#budget', window.BudgetView);
        this.addRoute('#profile', window.ProfileView);
        this.addRoute('#trip', window.TripView);
        this.addRoute('#shared', window.SharedTripView);
        this.addRoute('#packing', window.PackingView);
        
        // Handle Logout
        document.getElementById('logout-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('traveloop_token');
                localStorage.removeItem('traveloop_user');
                window.location.hash = '#login';
            }
        });

        this.handleRoute();
    }
}

window.appRouter = new Router();
document.addEventListener('DOMContentLoaded', () => window.appRouter.init());
