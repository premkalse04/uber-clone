/**
 * maps.service.js — Free OSM-based geocoding + OSRM routing (no API key required)
 *
 * Replaces Google Maps API calls with:
 *   getAddressCoordinate   → Nominatim geocode
 *   getDistanceTime        → OSRM driving route (real road distance + duration)
 *   getAutoCompleteSuggestions → Nominatim search autocomplete
 */
const axios = require('axios');
const captainModel = require('../models/captain.model');

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const OSRM_BASE = 'https://router.project-osrm.org';

const GEO_HEADERS = {
    'User-Agent': 'UberCloneApp/1.0 (contact@uberclone.local)',
    'Accept-Language': 'en',
};

// ── Geocode address → { ltd, lng } ──────────────────────────────────────────
module.exports.getAddressCoordinate = async (address) => {
    if (!address) throw new Error('Address is required');

    try {
        const { data } = await axios.get(`${NOMINATIM_BASE}/search`, {
            params: { q: address, format: 'json', limit: 1, countrycodes: 'in' },
            headers: GEO_HEADERS,
            timeout: 8000,
        });

        if (!data || !data.length) throw new Error('No results found for address: ' + address);

        return {
            ltd: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
        };
    } catch (err) {
        console.error('[maps] getAddressCoordinate error:', err.message);
        throw err;
    }
};

// ── Get road distance + duration using OSRM ─────────────────────────────────
// Returns an object mirroring the Google Distance Matrix element shape:
//   { distance: { value: <meters> }, duration: { value: <seconds> } }
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) throw new Error('Origin and destination are required');

    try {
        // Step 1: Geocode both addresses
        const [originCoords, destCoords] = await Promise.all([
            module.exports.getAddressCoordinate(origin),
            module.exports.getAddressCoordinate(destination),
        ]);

        // Step 2: Call OSRM routing API
        // Format: /route/v1/driving/{lng},{lat};{lng},{lat}
        const url = `${OSRM_BASE}/route/v1/driving/${originCoords.lng},${originCoords.ltd};${destCoords.lng},${destCoords.ltd}`;
        const { data } = await axios.get(url, {
            params: { overview: 'false', alternatives: 'false' },
            timeout: 10000,
        });

        if (!data || data.code !== 'Ok' || !data.routes || !data.routes.length) {
            throw new Error('OSRM returned no route');
        }

        const route = data.routes[0];

        // Return in the same shape as Google Distance Matrix so ride.service.js works unchanged
        return {
            distance: { value: Math.round(route.distance) },   // metres
            duration: { value: Math.round(route.duration) },   // seconds
        };
    } catch (err) {
        console.error('[maps] getDistanceTime error:', err.message);
        throw err;
    }
};

// ── Autocomplete suggestions via Nominatim ──────────────────────────────────
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) throw new Error('Query is required');

    try {
        const { data } = await axios.get(`${NOMINATIM_BASE}/search`, {
            params: {
                q: input,
                format: 'json',
                limit: 6,
                countrycodes: 'in',
                addressdetails: 0,
            },
            headers: GEO_HEADERS,
            timeout: 6000,
        });

        return (data ?? []).map(r => r.display_name).filter(Boolean);
    } catch (err) {
        console.error('[maps] getAutoCompleteSuggestions error:', err.message);
        return [];
    }
};

// ── Find captains within radius (unchanged) ─────────────────────────────────
module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371],
            },
        },
    });
    return captains;
};