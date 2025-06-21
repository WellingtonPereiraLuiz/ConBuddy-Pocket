import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Layers, X, Info } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { mapMarkers } from '../services/mockData';
import { Button } from '../components/ui/Button';
import 'mapbox-gl/dist/mapbox-gl.css';

// Em produção, utilize variáveis de ambiente.
mapboxgl.accessToken = 'pk.eyJ1IjoiYm9sc29jb25idWRkeSIsImEiOiJjbGs1a3hqZW4wMDJwM2duMWdmbnB5b2tsIn0.ueBlQK6O9VthaTLY83WZGA';

interface MapMarker {
  id: string;
  type: string;
  position: [number, number];
  title: string;
  description?: string;
  lngLat: [number, number];
}

const MapScreen = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    stages: true,
    booths: true,
    food: true,
    restrooms: true,
    exits: true,
    info: true,
  });

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-46.6718, -23.6267],
      zoom: 16,
      pitchWithRotate: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({ trackUserLocation: true }), 'top-right');

    map.current.on('load', () => {
      mapMarkers.forEach((marker) => {
        const el = document.createElement('div');
        el.className = 'flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white';
        el.setAttribute('data-type', marker.type);

        el.innerHTML = `<svg width="16" height="16" stroke="currentColor" fill="none"><circle cx="8" cy="8" r="6"/></svg>`;

        const markerInstance = new mapboxgl.Marker(el)
          .setLngLat([marker.position[1], marker.position[0]])
          .addTo(map.current!);

        el.addEventListener('click', () => {
          setSelectedMarker({
            ...marker,
            lngLat: [marker.position[1], marker.position[0]],
          });
        });
      });
    });

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    document.querySelectorAll('.mapboxgl-marker').forEach((marker) => {
      const type = marker.getAttribute('data-type');
      if (type && activeLayers.hasOwnProperty(type)) {
        marker.classList.toggle('hidden', !activeLayers[type as keyof typeof activeLayers]);
      }
    });
  }, [activeLayers]);

  const toggleLayer = (layer: keyof typeof activeLayers) =>
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));

  const closePopup = () => setSelectedMarker(null);

  const flyToMarker = (lngLat: [number, number]) =>
    map.current?.flyTo({ center: lngLat, zoom: 18, essential: true });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]"
    >
      <div ref={mapContainer} className="absolute inset-0" />

      <div className="absolute top-4 left-4 z-10">
        <Button onClick={() => setShowLayers(!showLayers)} className="shadow-md bg-white">
          <Layers className="h-6 w-6 text-primary" />
        </Button>

        {showLayers && (
          <motion.div className="mt-2 p-4 bg-white shadow-lg rounded-lg">
            <h3 className="font-bold mb-2">Camadas</h3>
            {Object.keys(activeLayers).map((layer) => (
              <div key={layer} className="flex items-center my-1">
                <input
                  type="checkbox"
                  id={layer}
                  checked={activeLayers[layer as keyof typeof activeLayers]}
                  onChange={() => toggleLayer(layer as keyof typeof activeLayers)}
                  className="h-4 w-4 text-primary rounded"
                />
                <label htmlFor={layer} className="ml-2 text-sm capitalize">
                  {layer}
                </label>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {selectedMarker && (
        <motion.div className="absolute bottom-0 bg-white shadow-lg rounded-t-xl p-4 w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-lg font-bold">{selectedMarker.title}</h3>
            </div>
            <button onClick={closePopup}>
              <X className="h-5 w-5" />
            </button>
          </div>
          {selectedMarker.description && (
            <p className="mt-2 text-sm text-gray-600">{selectedMarker.description}</p>
          )}
          <Button onClick={() => flyToMarker(selectedMarker.lngLat)} className="mt-4 w-full">
            <MapPin className="h-5 w-5 mr-2" />
            Navegar até aqui
          </Button>
        </motion.div>
      )}

      <div className="absolute bottom-4 right-4">
        <Button size="icon" className="shadow-md bg-white">
          <Info className="h-5 w-5 text-primary" />
        </Button>
      </div>
    </motion.div>
  );
};

export default MapScreen;
