// ── Free OSM-based geocoding & nearby search — no API key required ──

/**
 * Reverse-geocode { lat, lng } → display address string via Nominatim
 */
export async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'en', 'User-Agent': 'UberCloneApp/1.0' } }
        )
        const data = await res.json()
        return data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    } catch {
        return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    }
}

/**
 * Forward geocode address string → { lat, lng } or null
 */
export async function geocodeAddress(address) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=in`,
            { headers: { 'Accept-Language': 'en', 'User-Agent': 'UberCloneApp/1.0' } }
        )
        const data = await res.json()
        if (!data.length) return null
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    } catch { return null }
}

/**
 * Autocomplete search via Nominatim
 */
export async function searchPlaces(query) {
    if (!query || query.length < 3) return []
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&countrycodes=in&addressdetails=0`,
            { headers: { 'Accept-Language': 'en', 'User-Agent': 'UberCloneApp/1.0' } }
        )
        const data = await res.json()
        return data.map(r => r.display_name)
    } catch { return [] }
}

/**
 * Haversine distance in km
 */
function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Nearby search using OpenStreetMap Overpass API
 * type: 'airport' | 'train_station'
 */
const OVERPASS_QUERIES = {
    airport: (lat, lng, r) =>
        `[out:json][timeout:10];(node["aeroway"="aerodrome"](around:${r},${lat},${lng});way["aeroway"="aerodrome"](around:${r},${lat},${lng}););out center 5;`,
    train_station: (lat, lng, r) =>
        `[out:json][timeout:10];(node["railway"="station"](around:${r},${lat},${lng});node["railway"="halt"](around:${r},${lat},${lng}););out 5;`,
}

export async function fetchNearbyPlaces({ lat, lng, type, radiusM = 10000, limit = 3 }) {
    const query = OVERPASS_QUERIES[type]
    if (!query) return []
    try {
        const res = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: `data=${encodeURIComponent(query(lat, lng, radiusM))}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        const data = await res.json()
        return (data.elements ?? [])
            .map(el => {
                const elLat = el.lat ?? el.center?.lat
                const elLng = el.lon ?? el.center?.lon
                if (!elLat || !elLng) return null
                return {
                    placeId: String(el.id),
                    name: el.tags?.name ?? (type === 'airport' ? 'Airport' : 'Train Station'),
                    vicinity: el.tags?.['addr:city'] ?? el.tags?.['addr:state'] ?? '',
                    lat: elLat,
                    lng: elLng,
                    distanceKm: haversineKm(lat, lng, elLat, elLng),
                }
            })
            .filter(Boolean)
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .slice(0, limit)
    } catch { return [] }
}
