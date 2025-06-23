import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { formatDate } from '../services/mockData';
import { Event } from '../models/types';
import AllEventsModal from '../components/ui/AllEventsModal';

const HomeScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllEventsModal, setShowAllEventsModal] = useState(false);
  const { events, loading, error, getFeaturedEvents } = useEvents(searchTerm);

  const featuredEvents: Event[] = getFeaturedEvents();
  
  // Limitar eventos próximos a 6 conforme solicitado
  const upcomingEvents = events.slice(0, 6);

  const handleShowAllEvents = () => {
    setShowAllEventsModal(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Barra de Busca */}
      <form className="relative" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Buscar eventos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10 pr-12"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="bg-primary p-1 rounded-full">
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
        </button>
      </form>

      {/* Eventos em Destaque - Limitado a 2-3 eventos conforme solicitado */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Eventos em Destaque</h2>
          <Link to="/map" className="text-primary text-sm font-medium">Ver mapa</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-error">{error}</div>
        ) : featuredEvents.length > 0 ? (
          <div className="space-y-4">
            {featuredEvents.slice(0, 3).map((event) => (
              <Link to={`/event/${event.id}`} key={event.id}>
                <motion.div whileHover={{ scale: 0.98 }} className="card overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden rounded-lg">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-2">
                        {event.category}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-text-secondary line-clamp-2 mb-4">{event.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {event.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-text-secondary text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="mr-4">
                          {formatDate(event.startDate, 'dd MMM')} - {formatDate(event.endDate, 'dd MMM yyyy')}
                        </span>
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary">
            Nenhum evento em destaque encontrado.
          </div>
        )}
      </section>

      {/* Eventos Próximos - Implementação do botão "Ver Todos" funcional */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Eventos Próximos</h2>
          {/* Botão "Ver Todos" agora funcional */}
          <button 
            onClick={handleShowAllEvents}
            className="text-primary text-sm font-medium hover:underline"
          >
            Ver todos
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-error">{error}</div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <Link to={`/event/${event.id}`} key={event.id}>
                <motion.div whileHover={{ scale: 0.97 }} className="card h-full">
                  <div className="h-40 mb-3 overflow-hidden rounded-lg">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs mb-2">
                    {event.category}
                  </span>
                  <h3 className="font-bold mb-2 line-clamp-1">{event.title}</h3>
                  <div className="flex items-center text-text-secondary text-xs mb-3">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="mr-3">{formatDate(event.startDate, 'dd MMM')}</span>
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-text-secondary">
            Nenhum evento próximo encontrado.
          </div>
        )}
      </section>

      {/* Modal de Todos os Eventos */}
      <AllEventsModal 
        isOpen={showAllEventsModal}
        onClose={() => setShowAllEventsModal(false)}
        events={events}
      />
    </motion.div>
  );
};

export default HomeScreen;