import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { formatDate } from '../services/mockData';

const FavoritesScreen = () => {
  // In a real app, we would fetch the user's favorites from the backend
  // For now, we'll just use the first few events as mock favorites
  const { events, loading, error } = useEvents();
const [favorites, setFavorites] = useState(events.slice(0, 3));
  
  // Remover esta linha:
  // const [favorites, setFavorites] = useState(events.slice(0, 3));
  
  const handleRemoveFavorite = (eventId: string) => {
    setFavorites(favorites.filter(favorite => favorite.id !== eventId));
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold mb-6">Meus Favoritos</h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-error">{error}</div>
      ) : favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((event) => (
            <motion.div
              key={event.id}
              initial={{ x: 0 }}
              whileHover={{ scale: 0.99 }}
              className="card overflow-hidden relative"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/4 h-40 md:h-auto overflow-hidden rounded-lg">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 pr-10">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-2">
                    {event.category}
                  </span>
                  <Link to={`/event/${event.id}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{event.title}</h3>
                  </Link>
                  <div className="flex items-center text-text-secondary text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="mr-4">
                      {formatDate(event.startDate, 'dd MMM')} - {formatDate(event.endDate, 'dd MMM yyyy')}
                    </span>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{event.location}</span>
                  </div>
                  <Link to={`/event/${event.id}`} className="text-primary text-sm font-medium">
                    Ver detalhes
                  </Link>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(event.id)}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Remover dos favoritos"
                >
                  <Heart className="w-5 h-5 text-primary fill-primary" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full inline-flex mx-auto mb-4">
            <Heart className="w-12 h-12 text-text-secondary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Nenhum favorito ainda</h2>
          <p className="text-text-secondary mb-6">
            Você ainda não adicionou eventos aos seus favoritos. Explore eventos e adicione-os aqui!
          </p>
          <Link to="/" className="btn btn-primary">
            Explorar eventos
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default FavoritesScreen;