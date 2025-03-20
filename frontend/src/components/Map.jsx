import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import { useDispatch, useSelector } from "react-redux";
import { setMapLocation } from "../actions/mapActions";
import { markerIcon } from "../leaflet/markerIcon";

const Map = () => {
    const dispatch = useDispatch();
    const { latitude, longitude } = useSelector((state) => state.map);
    const mapRef = useRef(null);
    const mapInstance = useRef(null); // Store map instance
    const markerRef = useRef(null); // Store marker instance

    useEffect(() => {
        console.log("Map updated with lat:", latitude, "long:", longitude); // Debugging

        if (!mapInstance.current) {
            // Initialize map only once
            mapInstance.current = L.map(mapRef.current).setView([latitude, longitude], 13);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(mapInstance.current);

            // Initial marker
            markerRef.current = L.marker([latitude, longitude], { icon: markerIcon }) // 👈 Use the custom icon
                .addTo(mapInstance.current)
                .bindPopup("Room Location")
                .openPopup();

            // Add search bar
            const provider = new OpenStreetMapProvider();
            const searchControl = new GeoSearchControl({
                provider,
                style: "bar",
                showMarker: true,
                showPopup: true,
                autoClose: true,
                keepResult: true,
            });

            mapInstance.current.addControl(searchControl);

            // Update Redux state when a new location is searched
            mapInstance.current.on("geosearch/showlocation", (event) => {
                const { x, y } = event.location;
                dispatch(setMapLocation(y, x));
            });

        } else {
            // Update map position and marker dynamically
            mapInstance.current.setView([latitude, longitude], 13);

            if (markerRef.current) {
                markerRef.current.setLatLng([latitude, longitude]);
            }
        }

    }, [latitude, longitude, dispatch]);

    return (
        <div
            ref={mapRef}
            style={{
                height: "350px",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
        ></div>
    );
};

export default Map;
