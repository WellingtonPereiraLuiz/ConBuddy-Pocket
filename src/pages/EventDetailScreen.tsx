
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  Map as MapIcon,
} from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { formatDate } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { useFavorites } from '../hooks/useFavorites';
import { ItineraryModal } from '../components/ui/ItineraryModal';

// Definir claramente a interface do evento
interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
}

const EventDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, loading, error } = useEvents();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [isCurrentEventFavorite, setIsCurrentEventFavorite] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [showItineraryModal, setShowItineraryModal] = useState(false);

  useEffect(() => {
    if (id) {
      const eventData = getEventById(id);
      if (eventData) {
        setEvent(eventData as Event);
        setIsCurrentEventFavorite(isFavorite(eventData.id));
      } else {
        setEvent(null);
      }
    }
  }, [id, getEventById, isFavorite]);

  const toggleFavorite = () => {
    if (!event) return;
    if (isCurrentEventFavorite) {
      removeFavorite(event.id);
    } else {
      addFavorite({ ...event, tags: [] });
    }
    setIsCurrentEventFavorite(!isCurrentEventFavorite);
  };

  const handleShare = () => {
    if (!event) return;
    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(err => console.error('Share failed:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  const handleGoBack = () => navigate(-1);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-8">
        <p className="text-error mb-4">{error || 'Evento não encontrado'}</p>
        <Button onClick={handleGoBack}>Voltar</Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button
        onClick={handleGoBack}
        className="flex items-center text-text-secondary mb-4"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Voltar
      </button>

      <div className="relative rounded-xl overflow-hidden h-56 md:h-80 mb-6">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6">
            <span className="inline-block px-3 py-1 bg-primary/80 text-white rounded-full text-sm mb-2">
              {event.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <Button
          variant="outline"
          onClick={toggleFavorite}
          className={isCurrentEventFavorite ? 'bg-primary/10 text-primary' : ''}
        >
          <Heart className={`w-5 h-5 mr-2 ${isCurrentEventFavorite ? 'fill-primary' : ''}`} />
          {isCurrentEventFavorite ? 'Favoritado' : 'Favoritar'}
        </Button>

        <Button variant="outline" onClick={handleShare}>
          <Share2 className="w-5 h-5 mr-2" />
          Compartilhar
        </Button>

        <Button variant="outline" onClick={() => navigate('/map')}>
          <MapIcon className="w-5 h-5 mr-2" />
          Ver no mapa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <section className="card mb-6">
            <h2 className="text-xl font-bold mb-3">Sobre o evento</h2>
            <p className="text-text-secondary mb-4">{event.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Data</p>
                  <p className="font-medium">
                    {formatDate(event.startDate, 'dd MMM')} -{' '}
                    {formatDate(event.endDate, 'dd MMM')}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Local</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showItineraryModal && (
        <ItineraryModal 
          events={[{...event, tags: []}]} 
          onClose={() => setShowItineraryModal(false)}
          isOpen={showItineraryModal}
        />
      )}
    </motion.div>
  );
};

export default EventDetailScreen;

