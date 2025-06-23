import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Layers, X, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { mapMarkers } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';

// Importar CSS do Leaflet
import 'leaflet/dist/leaflet.css';

// Configurar ícones do Leaflet (necessário para React)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Criar ícones personalizados para diferentes tipos de marcadores
const createCustomIcon = (type: string) => {
  const colors: { [key: string]: string } = {
    stages: '#6366f1',      // Primary
    booths: '#06b6d4',      // Secondary  
    food: '#f97316',        // Accent
    restrooms: '#10b981',   // Success
    exits: '#ef4444',       // Error
    info: '#f59e0b'         // Warning
  };

  const color = colors[type] || '#6366f1';
  
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
             <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
           </div>`,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface MapMarker {
  id: string;
  type: string;
  position: [number, number];
  title: string;
  description?: string;
}

// Componente para controlar o tema do mapa
const MapThemeController = () => {
  const { isDarkMode } = useTheme();
  const map = useMap();

  useEffect(() => {
    // Remover camadas existentes
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Adicionar nova camada baseada no tema
    const tileLayer = isDarkMode
      ? L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20
        })
      : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 20
        });

    tileLayer.addTo(map);
  }, [isDarkMode, map]);

  return null;
};

const MapScreen = () => {
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

  // Centro de São Paulo conforme solicitado
  const centerPosition: [number, number] = [-23.55052, -46.633308];

  const toggleLayer = (layer: keyof typeof activeLayers) =>
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));

  const closePopup = () => setSelectedMarker(null);

  // Filtrar marcadores baseado nas camadas ativas
  const visibleMarkers = mapMarkers.filter(marker => 
    activeLayers[marker.type as keyof typeof activeLayers]
  );

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
      {/* Mapa usando React-Leaflet conforme solicitado */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <MapContainer
          center={centerPosition}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {/* Controle de tema do mapa */}
          <MapThemeController />
          
          {/* Marcadores filtrados */}
          {visibleMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={createCustomIcon(marker.type)}
              eventHandlers={{
                click: () => {
                  setSelectedMarker(marker);
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-1">{marker.title}</h3>
                  {marker.description && (
                    <p className="text-sm text-gray-600 mb-2">{marker.description}</p>
                  )}
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    {marker.type}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

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
                  {layerLabels[selectedMarker.type as keyof typeof layerLabels] || selectedMarker.type}
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
            onClick={closePopup}
            className="w-full"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Fechar
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

      {/* Legenda dos marcadores */}
      <div className="absolute top-4 right-4 z-10">
        <motion.div 
          className={`p-3 shadow-lg rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-200 text-gray-800'
          }`}
        >
          <h4 className="font-bold text-sm mb-2">Legenda</h4>
          <div className="space-y-1">
            {Object.entries(layerLabels).map(([type, label]) => (
              <div key={type} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-2 border border-white"
                  style={{ 
                    backgroundColor: {
                      stages: '#6366f1',
                      booths: '#06b6d4',
                      food: '#f97316',
                      restrooms: '#10b981',
                      exits: '#ef4444',
                      info: '#f59e0b'
                    }[type] || '#6366f1'
                  }}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MapScreen;