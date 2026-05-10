class TripBuilderView {
    constructor() {}

    async getHtml() {
        return `
            <div class="dashboard-header">
                <div>
                    <h1>Plan a New Trip</h1>
                    <p>Start designing your perfect itinerary.</p>
                </div>
            </div>

            <div class="card" style="max-width: 800px;">
                <form id="trip-builder-form">
                    <div class="form-group">
                        <label class="form-label">Trip Name</label>
                        <input type="text" id="trip-name" class="form-control" placeholder="e.g. Summer in Europe" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description (Optional)</label>
                        <textarea id="trip-desc" class="form-control" rows="3" placeholder="What's the vibe of this trip?"></textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div class="form-group">
                            <label class="form-label">Start Date</label>
                            <input type="date" id="trip-start" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">End Date</label>
                            <input type="date" id="trip-end" class="form-control" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Cover Photo</label>
                        <div style="border: 2px dashed var(--border-color); border-radius: var(--radius-md); padding: 40px; text-align: center; cursor: pointer; transition: all var(--transition-fast);" id="photo-upload-zone">
                            <i class="ph ph-image" style="font-size: 32px; color: var(--text-muted); margin-bottom: 8px;"></i>
                            <p>Click to upload a cover photo</p>
                            <input type="file" id="trip-photo" style="display: none;" accept="image/*">
                        </div>
                        <div id="upload-preview" style="margin-top: 16px; border-radius: var(--radius-md); overflow: hidden; height: 200px; display: none; background-size: cover; background-position: center;"></div>
                    </div>

                    <div id="form-error" style="color: var(--secondary); margin-bottom: 16px;"></div>

                    <div style="display: flex; justify-content: flex-end; gap: 16px; margin-top: 32px;">
                        <button type="button" class="btn btn-ghost" onclick="window.history.back()">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="save-trip-btn">Create Trip</button>
                    </div>
                </form>
            </div>
        `;
    }

    executeViewScript() {
        let uploadedPhotoUrl = null;

        const uploadZone = document.getElementById('photo-upload-zone');
        const fileInput = document.getElementById('trip-photo');
        const preview = document.getElementById('upload-preview');
        const saveBtn = document.getElementById('save-trip-btn');
        const errorDiv = document.getElementById('form-error');

        uploadZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Mock uploading state
            uploadZone.innerHTML = '<div class="spinner" style="margin: 0 auto;"></div><p style="margin-top: 16px;">Uploading...</p>';

            const formData = new FormData();
            formData.append('image', file);

            try {
                // Upload to our mock endpoint
                const token = api.getToken();
                const res = await fetch('/api/uploads', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const data = await api.handleResponse(res);
                
                uploadedPhotoUrl = data.imageUrl;
                
                uploadZone.style.display = 'none';
                preview.style.display = 'block';
                preview.style.backgroundImage = `url('${uploadedPhotoUrl}')`;

            } catch (err) {
                uploadZone.innerHTML = '<i class="ph ph-warning" style="font-size: 32px; color: var(--secondary);"></i><p>Upload failed. Try again.</p>';
            }
        });

        document.getElementById('trip-builder-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.textContent = '';
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>';

            const tripData = {
                name: document.getElementById('trip-name').value,
                description: document.getElementById('trip-desc').value,
                start_date: document.getElementById('trip-start').value,
                end_date: document.getElementById('trip-end').value,
                cover_photo: uploadedPhotoUrl
            };

            try {
                const res = await api.createTrip(tripData);
                window.location.hash = `#trip/${res.tripId}`;
            } catch (err) {
                errorDiv.textContent = err.message;
                saveBtn.disabled = false;
                saveBtn.textContent = 'Create Trip';
            }
        });
    }
}

window.TripBuilderView = TripBuilderView;
