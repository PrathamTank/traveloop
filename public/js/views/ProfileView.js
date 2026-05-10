class ProfileView {
    constructor() {}

    async getHtml() {
        var userStr = localStorage.getItem('traveloop_user');
        var user = userStr ? JSON.parse(userStr) : { name: 'User', email: '' };

        return '<div class="dashboard-header">' +
            '<div>' +
                '<h1>User Profile</h1>' +
                '<p>Manage your account settings and preferences.</p>' +
            '</div>' +
        '</div>' +

        '<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 32px;">' +
            '<div class="card" style="text-align: center; height: fit-content;">' +
                '<div style="width: 120px; height: 120px; border-radius: 50%; background: var(--gradient-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 700; margin: 0 auto 24px;">' +
                    user.name.charAt(0).toUpperCase() +
                '</div>' +
                '<h2>' + user.name + '</h2>' +
                '<p style="color: var(--text-muted); margin-bottom: 24px;">' + user.email + '</p>' +
                '<button class="btn btn-ghost" id="change-photo-btn" style="width: 100%; border: 1px solid var(--border-color);"><i class="ph ph-camera"></i> Change Photo</button>' +
            '</div>' +

            '<div class="card">' +
                '<form id="profile-update-form">' +
                    '<h3 style="margin-bottom: 24px;">Personal Information</h3>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Full Name</label>' +
                        '<input type="text" id="profile-name" class="form-control" value="' + user.name + '" required>' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Email Address</label>' +
                        '<input type="email" class="form-control" value="' + user.email + '" disabled>' +
                        '<small style="color: var(--text-muted);">Email cannot be changed.</small>' +
                    '</div>' +
                    
                    '<h3 style="margin: 32px 0 24px;">Preferences</h3>' +
                    '<div class="form-group">' +
                        '<label class="form-label">Language Preference</label>' +
                        '<select id="profile-language" class="form-control">' +
                            '<option value="en">English (US)</option>' +
                            '<option value="es">Español</option>' +
                            '<option value="fr">Français</option>' +
                            '<option value="de">Deutsch</option>' +
                        '</select>' +
                    '</div>' +
                    
                    '<div style="display: flex; justify-content: flex-end; margin-top: 32px; gap: 16px;">' +
                        '<button type="button" class="btn btn-ghost" id="delete-account-btn" style="color: var(--secondary);">Delete Account</button>' +
                        '<button type="submit" class="btn btn-primary">Save Changes</button>' +
                    '</div>' +
                '</form>' +
            '</div>' +
        '</div>' +

        '<h2 style="margin-top: 48px; margin-bottom: 24px;">Saved Destinations</h2>' +
        '<div class="card" style="text-align: center; padding: 48px;">' +
            '<i class="ph ph-heart" style="font-size: 48px; color: var(--secondary); margin-bottom: 16px;"></i>' +
            '<p>You haven\'t saved any destinations yet. Explore and heart them to see them here!</p>' +
            '<a href="#explore" class="btn btn-ghost" style="margin-top: 16px; border: 1px solid var(--border-color);">Explore Now</a>' +
        '</div>';
    }

    executeViewScript() {
        var profileForm = document.getElementById('profile-update-form');
        if (!profileForm) return;

        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.getElementById('profile-name').value;
            var user = JSON.parse(localStorage.getItem('traveloop_user'));
            user.name = name;
            localStorage.setItem('traveloop_user', JSON.stringify(user));
            alert('Profile updated successfully!');
            window.location.reload();
        });

        document.getElementById('delete-account-btn').addEventListener('click', function() {
            if (confirm('Are you absolutely sure? This will delete all your trips and data permanently.')) {
                alert('Account deleted. Redirecting...');
                localStorage.clear();
                window.location.hash = '#login';
                window.location.reload();
            }
        });
        
        document.getElementById('change-photo-btn').addEventListener('click', function() {
            alert('Photo upload functionality coming soon!');
        });
    }
}

window.ProfileView = ProfileView;
