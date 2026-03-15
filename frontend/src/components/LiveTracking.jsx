import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/**
 * LiveTracking — pure Leaflet.js (no react-leaflet)
 * Shows user's live GPS position on OpenStreetMap
 */
const LiveTracking = () => {
    const containerRef = useRef(null)
    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const watchIdRef = useRef(null)

    // Build pulsing blue icon HTML
    const buildUserIcon = () => L.divIcon({
        className: '',
        html: `
            <div style="position:relative;width:20px;height:20px;">
                <div style="position:absolute;inset:0;background:#3b82f6;border-radius:50%;
                    border:3px solid #fff;box-shadow:0 2px 8px rgba(59,130,246,0.5);z-index:2;"></div>
                <div style="position:absolute;inset:-8px;background:rgba(59,130,246,0.2);
                    border-radius:50%;animation:pulse 2s ease-out infinite;"></div>
            </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    })

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return

        // Init map centred on India until GPS fires
        mapRef.current = L.map(containerRef.current, {
            center: [23.0225, 72.5714],
            zoom: 14,
            zoomControl: true,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(mapRef.current)

        const updatePosition = ({ coords }) => {
            const latlng = { lat: coords.latitude, lng: coords.longitude }
            if (!markerRef.current) {
                markerRef.current = L.marker([latlng.lat, latlng.lng], { icon: buildUserIcon() })
                    .addTo(mapRef.current)
            } else {
                markerRef.current.setLatLng([latlng.lat, latlng.lng])
            }
            mapRef.current.setView([latlng.lat, latlng.lng], mapRef.current.getZoom(), { animate: true })
        }

        const geoOptions = { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }

        const onError = (err) => {
            console.warn('[LiveTracking] Geolocation error:', err.code, err.message)
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(updatePosition, onError, geoOptions)
            watchIdRef.current = navigator.geolocation.watchPosition(updatePosition, onError, geoOptions)
        }

        return () => {
            if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
        }
    }, [])

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default LiveTracking