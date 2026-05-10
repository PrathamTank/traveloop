// Simple API Wrapper using Fetch
var API_URL = '/api';

var api = {
    handleResponse: async function(res) {
        var data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Something went wrong');
        }
        return data;
    },

    getToken: function() {
        return localStorage.getItem('traveloop_token');
    },

    fetchWithAuth: async function(url, options) {
        options = options || {};
        var token = this.getToken();
        var headers = {
            'Content-Type': 'application/json'
        };
        if (options.headers) {
            Object.assign(headers, options.headers);
        }
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        var res = await fetch(API_URL + url, Object.assign({}, options, { headers: headers }));
        return this.handleResponse(res);
    },

    // Auth
    login: async function(email, password) {
        var res = await fetch(API_URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });
        return this.handleResponse(res);
    },

    register: async function(name, email, password) {
        var res = await fetch(API_URL + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, password: password })
        });
        return this.handleResponse(res);
    },

    // Trips
    getTrips: async function() {
        return await this.fetchWithAuth('/trips');
    },

    getTripDetails: async function(id) {
        return await this.fetchWithAuth('/trips/' + id);
    },

    createTrip: async function(tripData) {
        return await this.fetchWithAuth('/trips', {
            method: 'POST',
            body: JSON.stringify(tripData)
        });
    },

    deleteTrip: async function(id) {
        return await this.fetchWithAuth('/trips/' + id, {
            method: 'DELETE'
        });
    },

    addStop: async function(tripId, stopData) {
        return await this.fetchWithAuth('/trips/' + tripId + '/stops', {
            method: 'POST',
            body: JSON.stringify(stopData)
        });
    },

    deleteStop: async function(tripId, stopId) {
        return await this.fetchWithAuth('/trips/' + tripId + '/stops/' + stopId, {
            method: 'DELETE'
        });
    },

    addActivity: async function(tripId, stopId, activityData) {
        return await this.fetchWithAuth('/trips/' + tripId + '/stops/' + stopId + '/activities', {
            method: 'POST',
            body: JSON.stringify(activityData)
        });
    },

    deleteActivity: async function(tripId, stopId, activityId) {
        return await this.fetchWithAuth('/trips/' + tripId + '/stops/' + stopId + '/activities/' + activityId, {
            method: 'DELETE'
        });
    },

    // Notes
    addNote: async function(tripId, content) {
        return await this.fetchWithAuth('/trips/' + tripId + '/notes', {
            method: 'POST',
            body: JSON.stringify({ content: content })
        });
    },

    deleteNote: async function(tripId, noteId) {
        return await this.fetchWithAuth('/trips/' + tripId + '/notes/' + noteId, {
            method: 'DELETE'
        });
    },

    // Packing
    addPackingItem: async function(tripId, category, item_name) {
        return await this.fetchWithAuth('/trips/' + tripId + '/packing', {
            method: 'POST',
            body: JSON.stringify({ category: category, item_name: item_name })
        });
    },

    togglePackingItem: async function(tripId, itemId, is_packed) {
        return await this.fetchWithAuth('/trips/' + tripId + '/packing/' + itemId, {
            method: 'PUT',
            body: JSON.stringify({ is_packed: is_packed })
        });
    },

    deletePackingItem: async function(tripId, itemId) {
        return await this.fetchWithAuth('/trips/' + tripId + '/packing/' + itemId, {
            method: 'DELETE'
        });
    },

    // Sharing
    shareTrip: async function(tripId) {
        return await this.fetchWithAuth('/trips/' + tripId + '/share', {
            method: 'POST'
        });
    },

    getSharedTrip: async function(token) {
        var res = await fetch(API_URL + '/trips/shared/' + token);
        return this.handleResponse(res);
    },

    copySharedTrip: async function(token) {
        return await this.fetchWithAuth('/trips/shared/' + token + '/copy', {
            method: 'POST'
        });
    }
};

window.api = api;
