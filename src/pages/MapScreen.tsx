import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Layers, X, Info } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { mapMarkers } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import 'mapbox-gl/dist/mapbox-gl.css';

// Token do Mapbox (em produção, utilize variáveis de ambiente)
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
  const { isDarkMode } = useTheme();

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

    // Escolher estilo baseado no tema
    const mapStyle = isDarkMode 
      ? 'mapbox://styles/mapbox/dark-v11' 
      : 'mapbox://styles/mapbox/light-v11';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [-46.6718, -23.6267],
      zoom: 16,
      pitchWithRotate: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.GeolocateControl({ trackUserLocation: true }), 'top-right');

    map.current.on('load', () => {
      mapMarkers.forEach((marker) => {
        const el = document.createElement('div');
        el.className = 'flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-lg cursor-pointer hover:scale-110 transition-transform';
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

  // Atualizar estilo do mapa quando o tema mudar
  useEffect(() => {
    if (map.current) {
      const mapStyle = isDarkMode 
        ? 'mapbox://styles/mapbox/dark-v11' 
        : 'mapbox://styles/mapbox/light-v11';
      
      map.current.setStyle(mapStyle);
    }
  }, [isDarkMode]);

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

  const layerLabels = {
    stages: 'Palcos',
    booths: 'Estandes',
    food: 'Alimentação',
    restrooms: 'Banheiros',
    exits: 'Saídas',
    info: 'Informações'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]"
    >
      <div ref={mapContainer} className="absolute inset-0 rounded-xl overflow-hidden" />

      {/* Controles de camadas - Melhorados para tema escuro */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          onClick={() => setShowLayers(!showLayers)} 
          className={`shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' 
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
          }`}
          variant="outline"
        >
          <Layers className="h-5 w-5" />
        </Button>

        {showLayers && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-2 p-4 shadow-xl rounded-lg border min-w-[200px] ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">Filtros do Mapa</h3>
            <div className="space-y-2">
              {Object.entries(activeLayers).map(([layer, isActive]) => (
                <div key={layer} className="flex items-center justify-between">
                  <label 
                    htmlFor={layer} 
                    className={`text-sm cursor-pointer ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {layerLabels[layer as keyof typeof layerLabels]}
                  </label>
                  <input
                    type="checkbox"
                    id={layer}
                    checked={isActive}
                    onChange={() => toggleLayer(layer as keyof typeof activeLayers)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Popup de informações do marcador - Melhorado para tema escuro */}
      {selectedMarker && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bottom-0 left-0 right-0 shadow-2xl rounded-t-xl p-6 border-t ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-200 text-gray-800'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full mr-3">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{selectedMarker.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedMarker.type}
                </span>
              </div>
            </div>
            <button 
              onClick={closePopup}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {selectedMarker.description && (
            <p className={`mb-4 text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {selectedMarker.description}
            </p>
          )}
          
          <Button 
            onClick={() => flyToMarker(selectedMarker.lngLat)} 
            className="w-full"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Centralizar no mapa
          </Button>
        </motion.div>
      )}

      {/* Botão de informações - Melhorado para tema escuro */}
      <div className="absolute bottom-4 right-4">
        <Button 
          size="icon" 
          className={`shadow-lg ${
            isDarkMode 
              ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' 
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
          }`}
          variant="outline"
          title="Informações do mapa"
        >
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default MapScreen;