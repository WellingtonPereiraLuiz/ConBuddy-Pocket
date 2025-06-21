import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, Clock } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { formatDate } from '../services/mockData';

const FavoritesScreen = () => {
  const { favorites, removeFavorite } = useFavorites();
  
  // Função para calcular dias restantes
  const getDaysUntilEvent = (startDate: string) => {
    const eventDate = new Date(startDate);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleRemoveFavorite = (eventId: string) => {
    removeFavorite(eventId);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Meus Favoritos</h1>
        <span className="text-sm text-text-secondary bg-primary/10 px-3 py-1 rounded-full">
          {favorites.length} {favorites.length === 1 ? 'evento' : 'eventos'}
        </span>
      </div>
      
      {favorites.length > 0 ? (
        <div className="space-y-4">
          {favorites.map((event) => {
            const daysUntilEvent = getDaysUntilEvent(event.startDate);
            
            return (
              <motion.div
                key={event.id}
                initial={{ x: 0 }}
                whileHover={{ scale: 0.99 }}
                className="card overflow-hidden relative group"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/4 h-40 md:h-auto overflow-hidden rounded-lg">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="flex-1 pr-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {event.category}
                      </span>
                      {daysUntilEvent > 0 && (
                        <span className="inline-flex items-center px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {daysUntilEvent === 1 ? 'Amanhã' : `${daysUntilEvent} dias`}
                        </span>
                      )}
                    </div>
                    
                    <Link to={`/event/${event.id}`}>
                      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                    </Link>
                    
                    <p className="text-text-secondary text-sm mb-3 line-clamp-2">
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
                    
                    {/* Tags do evento */}
                    {event.tags && event.tags.length > 0 && (
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
                    )}
                    
                    <Link 
                      to={`/event/${event.id}`} 
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Ver detalhes →
                    </Link>
                  </div>
                  
                  {/* Botão de remover favorito */}
                  <button
                    onClick={() => handleRemoveFavorite(event.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-800 transition-colors group"
                    aria-label="Remover dos favoritos"
                    title="Remover dos favoritos"
                  >
                    <Heart className="w-5 h-5 text-primary fill-primary group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full inline-flex mx-auto mb-4">
            <Heart className="w-12 h-12 text-text-secondary" />
          </div>
          <h2 className="text-xl font-bold mb-2">Nenhum favorito ainda</h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Você ainda não adicionou eventos aos seus favoritos. Explore eventos e adicione-os aqui para acompanhar facilmente!
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