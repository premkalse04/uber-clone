import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/**
 * MapView — pure Leaflet.js (no react-leaflet)
 * Props:
 *   userLocation       { lat, lng } | null
 *   destinationLocation { lat, lng } | null
 *   suggestionMarkers  [{ lat, lng, name, placeId }]
 */
const MapView = ({ userLocation, destinationLocation, suggestionMarkers = [] }) => {
    const containerRef = useRef(null)
    const mapRef = useRef(null)
    const userMarkerRef = useRef(null)
    const destMarkerRef = useRef(null)
    const suggMarkersRef = useRef([])
    const polylineRef = useRef(null)

    // ── Custom icons ────────────────────────────────────────────
    const userIcon = L.divIcon({
        className: '',
        html: `<div style="position:relative;width:20px;height:20px;">
            <div style="position:absolute;inset:0;background:#3b82f6;border-radius:50%;
                border:3px solid #fff;box-shadow:0 2px 10px rgba(59,130,246,0.6);z-index:2;"></div>
            <div style="position:absolute;inset:-8px;background:rgba(59,130,246,0.2);
                border-radius:50%;animation:pulse 2s ease-out infinite;"></div>
        </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    })

    const destIcon = L.divIcon({
        className: '',
        html: `<div style="background:#111827;width:14px;height:14px;border-radius:50%;
            border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
    })

    const suggIcon = L.divIcon({
        className: '',
        html: `<div style="background:#6366f1;width:10px;height:10px;border-radius:50%;
            border:2px solid #fff;opacity:0.8;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    })

    // ── Init map once ────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return

        // Always init at a reasonable zoom — GPS will pan to actual position shortly
        mapRef.current = L.map(containerRef.current, {
            center: userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629],
            zoom: 14,
            zoomControl: true,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(mapRef.current)

        return () => {
            if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
        }
    }, [])

    // ── User location marker + pan ───────────────────────────────
    useEffect(() => {
        if (!mapRef.current || !userLocation) return

        if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng])
        } else {
            userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                .addTo(mapRef.current)
        }

        if (!destinationLocation) {
            mapRef.current.setView([userLocation.lat, userLocation.lng], 15, { animate: true })
        }
    }, [userLocation])

    // ── Destination marker + route polyline ──────────────────────
    useEffect(() => {
        if (!mapRef.current) return

        // Clear old destination marker + polyline
        if (destMarkerRef.current) { destMarkerRef.current.remove(); destMarkerRef.current = null }
        if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null }

        if (!destinationLocation) return

        destMarkerRef.current = L.marker([destinationLocation.lat, destinationLocation.lng], { icon: destIcon })
            .addTo(mapRef.current)

        // Draw dashed polyline
        if (userLocation) {
            polylineRef.current = L.polyline(
                [[userLocation.lat, userLocation.lng], [destinationLocation.lat, destinationLocation.lng]],
                { color: '#111827', weight: 4, opacity: 0.85, dashArray: '10 8' }
            ).addTo(mapRef.current)

            // Fit both points in view
            const bounds = L.latLngBounds(
                [userLocation.lat, userLocation.lng],
                [destinationLocation.lat, destinationLocation.lng]
            )
            mapRef.current.fitBounds(bounds, { padding: [60, 60], animate: true })
        } else {
            mapRef.current.setView([destinationLocation.lat, destinationLocation.lng], 14, { animate: true })
        }
    }, [destinationLocation])

    // ── Suggestion markers ───────────────────────────────────────
    useEffect(() => {
        if (!mapRef.current) return
        suggMarkersRef.current.forEach(m => m.remove())
        suggMarkersRef.current = suggestionMarkers.map(p =>
            L.marker([p.lat, p.lng], { icon: suggIcon })
                .bindTooltip(p.name, { permanent: false, direction: 'top' })
                .addTo(mapRef.current)
        )
    }, [suggestionMarkers])

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

export default MapView
