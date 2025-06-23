import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Calendar, MapPin, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Event } from '../../models/types';
import { formatDate } from '../../services/mockData';

interface AllEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
}

const AllEventsModal = ({ isOpen, onClose, events }: AllEventsModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Obter categorias únicas dos eventos
  const categories = Array.from(new Set(events.map(event => event.category)));

  // Filtrar eventos baseado na busca e categoria
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold">Todos os Eventos</h2>
              <p className="text-text-secondary text-sm mt-1">
                {filteredEvents.length} de {events.length} eventos
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filtros */}
          <div className="p-6 border-b border-border space-y-4">
            {/* Barra de busca */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Filtro por categoria */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-text-secondary" />
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de eventos com scroll */}
          <div className="overflow-y-auto max-h-[60vh] p-6">
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs mb-1">
                              {event.category}
                            </span>
                            <h3 className="font-bold text-lg line-clamp-1">{event.title}</h3>
                          </div>
                          {event.isFeatured && (
                            <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs ml-2">
                              Destaque
                            </span>
                          )}
                        </div>
                        
                        <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center text-text-secondary text-sm mb-3">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span className="mr-4">
                            {formatDate(event.startDate, 'dd MMM')} - {formatDate(event.endDate, 'dd MMM yyyy')}
                          </span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {event.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                              +{event.tags.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <Link 
                          to={`/event/${event.id}`} 
                          onClick={onClose}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          Ver detalhes →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full inline-flex mx-auto mb-4">
                  <Search className="w-12 h-12 text-text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nenhum evento encontrado</h3>
                <p className="text-text-secondary">
                  Tente ajustar os filtros ou termos de busca para encontrar eventos.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AllEventsModal;