class LoginView {
    constructor() {
        this.isRegistering = window.location.hash === '#register';
    }

    async getHtml() {
        return `
            <div class="auth-container">
                <div class="auth-form-wrapper">
                    <div class="card auth-card">
                        <div class="auth-title">
                            <i class="ph ph-paper-plane-tilt logo-icon" style="font-size: 48px; margin-bottom: 16px; display: inline-block;"></i>
                            <h2>${this.isRegistering ? 'Create an Account' : 'Welcome Back'}</h2>
                            <p>${this.isRegistering ? 'Start planning your next adventure.' : 'Log in to continue planning.'}</p>
                        </div>
                        <form id="auth-form">
                            ${this.isRegistering ? `
                                <div class="form-group">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" id="name" class="form-control" placeholder="John Doe" required>
                                </div>
                            ` : ''}
                            <div class="form-group">
                                <label class="form-label">Email Address</label>
                                <input type="email" id="email" class="form-control" placeholder="you@example.com" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Password</label>
                                <input type="password" id="password" class="form-control" placeholder="••••••••" required>
                            </div>
                            <div id="auth-error" style="color: var(--secondary); margin-bottom: 16px; font-size: 0.875rem;"></div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
                                ${this.isRegistering ? 'Sign Up' : 'Log In'}
                            </button>
                        </form>
                        <div style="text-align: center; margin-top: 24px; font-size: 0.875rem;">
                            ${this.isRegistering ? 
                                `Already have an account? <a href="#login">Log In</a>` : 
                                `Don't have an account? <a href="#register">Sign Up</a>`
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    executeViewScript() {
        document.getElementById('auth-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('auth-error');
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            errorDiv.textContent = '';
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>';

            try {
                if (this.isRegistering) {
                    const name = document.getElementById('name').value;
                    await api.register(name, email, password);
                    // After successful register, switch to login
                    window.location.hash = '#login';
                } else {
                    const data = await api.login(email, password);
                    localStorage.setItem('traveloop_token', data.token);
                    localStorage.setItem('traveloop_user', JSON.stringify(data.user));
                    window.location.hash = '#dashboard';
                }
            } catch (err) {
                errorDiv.textContent = err.message;
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = this.isRegistering ? 'Sign Up' : 'Log In';
            }
        });
    }
}

window.LoginView = LoginView;
