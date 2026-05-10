class LandingView {
    constructor() {
    }

    async getHtml() {
        return `
            <div class="landing-container">
                <div class="landing-content">
                    <div class="landing-hero">
                        <div class="landing-badge">
                            <i class="ph ph-sparkle"></i>
                            <span>Discover the future of travel planning</span>
                        </div>
                        <h1 class="landing-title">Plan your next <span class="text-gradient">adventure</span> with ease.</h1>
                        <p class="landing-description">
                            Traveloop helps you organize itineraries, manage budgets, and discover new destinations 
                            all in one beautiful place. Join thousands of travelers planning their dream trips.
                        </p>
                        <div class="landing-actions">
                            <a href="#register" class="btn btn-primary btn-lg">
                                <i class="ph ph-user-plus"></i> Get Started for Free
                            </a>
                            <a href="#login" class="btn btn-secondary-outline btn-lg">
                                <i class="ph ph-sign-in"></i> Log In
                            </a>
                        </div>
                    </div>

                    <div class="landing-features">
                        <div class="feature-card">
                            <div class="feature-icon"><i class="ph ph-map-trifold"></i></div>
                            <h3>Smart Itineraries</h3>
                            <p>Build day-by-day plans with activities, transport, and stays.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="ph ph-wallet"></i></div>
                            <h3>Budget Tracking</h3>
                            <p>Keep your travel expenses in check with real-time tracking.</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon"><i class="ph ph-compass"></i></div>
                            <h3>Explore More</h3>
                            <p>Get personalized recommendations for your next destination.</p>
                        </div>
                    </div>
                </div>
                
                <div class="landing-bg-elements">
                    <div class="blob blob-1"></div>
                    <div class="blob blob-2"></div>
                </div>
            </div>

            <style>
                .landing-container {
                    min-height: 100vh;
                    width: 100vw;
                    margin: -32px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--bg-main);
                    position: relative;
                    overflow: hidden;
                    padding: 40px 20px;
                }

                .landing-content {
                    max-width: 1000px;
                    width: 100%;
                    z-index: 10;
                    text-align: center;
                }

                .landing-hero {
                    margin-bottom: 64px;
                    animation: fadeInUp 0.8s ease-out;
                }

                .landing-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(79, 70, 229, 0.1);
                    color: var(--primary);
                    padding: 8px 16px;
                    border-radius: var(--radius-pill);
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 24px;
                }

                .landing-title {
                    font-size: clamp(2.5rem, 8vw, 4.5rem);
                    line-height: 1.1;
                    margin-bottom: 24px;
                    color: var(--text-primary);
                    letter-spacing: -2px;
                }

                .text-gradient {
                    background: var(--gradient-primary);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .landing-description {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    max-width: 600px;
                    margin: 0 auto 40px;
                    line-height: 1.6;
                }

                .landing-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn-lg {
                    padding: 16px 32px;
                    font-size: 1.125rem;
                }

                .btn-secondary-outline {
                    background: transparent;
                    border: 2px solid var(--border-color);
                    color: var(--text-primary);
                }

                .btn-secondary-outline:hover {
                    background: var(--bg-hover);
                    border-color: var(--text-muted);
                }

                .landing-features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 24px;
                    animation: fadeInUp 1s ease-out 0.2s both;
                }

                .feature-card {
                    background: var(--bg-surface);
                    padding: 32px;
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-color);
                    text-align: left;
                    transition: all var(--transition-normal);
                }

                .feature-card:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--primary-light);
                }

                .feature-icon {
                    width: 48px;
                    height: 48px;
                    background: var(--gradient-primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-md);
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                .feature-card h3 {
                    margin-bottom: 12px;
                }

                .landing-bg-elements {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1;
                    pointer-events: none;
                }

                .blob {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    background: var(--primary);
                    filter: blur(120px);
                    opacity: 0.05;
                    border-radius: 50%;
                }

                .blob-1 {
                    top: -200px;
                    right: -100px;
                }

                .blob-2 {
                    bottom: -200px;
                    left: -100px;
                    background: var(--secondary);
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .landing-container {
                        padding-top: 80px;
                    }
                    .landing-actions {
                        flex-direction: column;
                    }
                    .btn-lg {
                        width: 100%;
                    }
                }
            </style>
        `;
    }

    executeViewScript() {
        // No complex scripts needed for landing page for now
    }
}

window.LandingView = LandingView;
