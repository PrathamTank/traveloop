class PackingView {
    constructor(tripId) {
        this.tripId = tripId;
        this.tripData = null;
    }

    async getHtml() {
        try {
            this.tripData = await api.getTripDetails(this.tripId);
        } catch (e) {
            console.error(e);
            return '<div class="card"><h2 style="color:var(--secondary)">Trip not found</h2></div>';
        }

        var trip = this.tripData;
        var items = trip.packing_items || [];
        
        var categories = ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'Other'];
        var categoryHtml = categories.map(function(cat) {
            var catItems = items.filter(function(i) { return i.category === cat; });
            var itemsHtml = catItems.map(function(item) {
                return '<div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-hover); border-radius: var(--radius-sm); margin-bottom: 8px;">' +
                    '<div style="display: flex; align-items: center; gap: 12px;">' +
                        '<input type="checkbox" class="toggle-item" data-id="' + item.id + '" ' + (item.is_packed ? 'checked' : '') + ' style="width: 20px; height: 20px; cursor: pointer;">' +
                        '<span style="' + (item.is_packed ? 'text-decoration: line-through; color: var(--text-muted);' : '') + '">' + item.item_name + '</span>' +
                    '</div>' +
                    '<button class="btn btn-ghost delete-item" data-id="' + item.id + '" style="padding: 4px; color: var(--secondary);"><i class="ph ph-trash"></i></button>' +
                '</div>';
            }).join('');

            return '<div class="card" style="margin-bottom: 24px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">' +
                    '<h3 style="margin:0;">' + cat + '</h3>' +
                    '<span style="font-size: 0.8rem; background: var(--bg-hover); padding: 4px 8px; border-radius: var(--radius-pill);">' + catItems.length + ' items</span>' +
                '</div>' +
                '<div>' + (itemsHtml || '<p style="color:var(--text-muted); font-size:0.875rem;">No items added yet.</p>') + '</div>' +
                '<div style="display: flex; gap: 8px; margin-top: 16px;">' +
                    '<input type="text" class="form-control item-input" data-category="' + cat + '" placeholder="Add ' + cat + ' item..." style="font-size: 0.875rem;">' +
                    '<button class="btn btn-primary add-item-btn" data-category="' + cat + '" style="padding: 8px 16px;"><i class="ph ph-plus"></i></button>' +
                '</div>' +
            '</div>';
        }).join('');

        return '<div class="dashboard-header">' +
            '<div>' +
                '<a href="#trip/' + this.tripId + '" style="text-decoration: none; color: var(--primary); display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                    '<i class="ph ph-arrow-left"></i> Back to Itinerary' +
                '</a>' +
                '<h1>Packing Checklist</h1>' +
                '<p>Ensure you have everything ready for <strong>' + trip.name + '</strong></p>' +
            '</div>' +
            '<div>' +
                '<button class="btn btn-ghost" id="reset-checklist" style="border: 1px solid var(--border-color);"><i class="ph ph-arrows-counter-clockwise"></i> Reset List</button>' +
            '</div>' +
        '</div>' +
        '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px;">' +
            categoryHtml +
        '</div>';
    }

    executeViewScript() {
        if (!this.tripData) return;
        var self = this;

        // Add Item
        document.querySelectorAll('.add-item-btn').forEach(function(btn) {
            btn.addEventListener('click', async function() {
                var cat = btn.dataset.category;
                var input = document.querySelector('.item-input[data-category="' + cat + '"]');
                if (!input.value.trim()) return;
                
                try {
                    await api.addPackingItem(self.tripId, cat, input.value.trim());
                    window.appRouter.handleRoute();
                } catch (err) { alert(err.message); }
            });
        });

        // Toggle Item
        document.querySelectorAll('.toggle-item').forEach(function(cb) {
            cb.addEventListener('change', async function() {
                try {
                    await api.togglePackingItem(self.tripId, cb.dataset.id, cb.checked ? 1 : 0);
                    window.appRouter.handleRoute();
                } catch (err) { alert(err.message); }
            });
        });

        // Delete Item
        document.querySelectorAll('.delete-item').forEach(function(btn) {
            btn.addEventListener('click', async function() {
                try {
                    await api.deletePackingItem(self.tripId, btn.dataset.id);
                    window.appRouter.handleRoute();
                } catch (err) { alert(err.message); }
            });
        });

        // Reset Checklist
        document.getElementById('reset-checklist').addEventListener('click', async function() {
            if (confirm('Reset all items to unpacked?')) {
                var items = self.tripData.packing_items || [];
                for (var item of items) {
                    if (item.is_packed) {
                        await api.togglePackingItem(self.tripId, item.id, 0);
                    }
                }
                window.appRouter.handleRoute();
            }
        });
    }
}

window.PackingView = PackingView;
