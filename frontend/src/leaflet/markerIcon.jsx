import L from 'leaflet';

export const markerIcon = new L.Icon({
  iconUrl: '/media/img/leaflet/marker-icon.png',
  iconRetinaUrl: '/media/img/leaflet/marker-icon-2x.png',
  shadowUrl: '/media/img/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
