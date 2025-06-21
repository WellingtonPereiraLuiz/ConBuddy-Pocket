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
  Plus,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { formatDate } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { useFavorites } from '../hooks/useFavorites';
import { useAgenda } from '../hooks/useAgenda';
import { ItineraryModal } from '../components/ui/ItineraryModal';

// Interface do evento
interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  tags: string[];
}

const EventDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, loading, error } = useEvents();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { isInAgenda, addToAgenda, removeFromAgenda } = useAgenda();

  const [isCurrentEventFavorite, setIsCurrentEventFavorite] = useState(false);
  const [isCurrentEventInAgenda, setIsCurrentEventInAgenda] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);

  useEffect(() => {
    if (id) {
      const eventData = getEventById(id);
      if (eventData) {
        const eventWithTags = { ...eventData, tags: eventData.tags || [] } as Event;
        setEvent(eventWithTags);
        setIsCurrentEventFavorite(isFavorite(eventData.id));
        setIsCurrentEventInAgenda(isInAgenda(eventData.id));
      } else {
        setEvent(null);
      }
    }
  }, [id, getEventById, isFavorite, isInAgenda]);

  // Função para alternar favorito
  const toggleFavorite = () => {
    if (!event) return;
    
    if (isCurrentEventFavorite) {
      removeFavorite(event.id);
      setIsCurrentEventFavorite(false);
    } else {
      addFavorite(event);
      setIsCurrentEventFavorite(true);
    }
  };

  // Função para alternar agenda
  const toggleAgenda = () => {
    if (!event) return;
    
    if (isCurrentEventInAgenda) {
      removeFromAgenda(event.id);
      setIsCurrentEventInAgenda(false);
    } else {
      addToAgenda(event);
      setIsCurrentEventInAgenda(true);
    }
  };

  // Função para gerar rota com IA (simulada)
  const generateAIRoute = async () => {
    if (!event) return;
    
    setIsGeneratingRoute(true);
    
    // Simular chamada de API da IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGeneratingRoute(false);
    setShowItineraryModal(true);
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

  // Função para calcular dias restantes
  const getDaysUntilEvent = (startDate: string) => {
    const eventDate = new Date(startDate);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

  const daysUntilEvent = getDaysUntilEvent(event.startDate);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button
        onClick={handleGoBack}
        className="flex items-center text-text-secondary mb-4 hover:text-primary transition-colors"
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
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{event.title}</h1>
            {daysUntilEvent > 0 && (
              <div className="flex items-center text-white/90">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {daysUntilEvent === 1 ? 'Amanhã' : `${daysUntilEvent} dias restantes`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Button
          variant="outline"
          onClick={toggleFavorite}
          className={isCurrentEventFavorite ? 'bg-primary/10 text-primary border-primary' : ''}
        >
          <Heart className={`w-5 h-5 mr-2 ${isCurrentEventFavorite ? 'fill-primary' : ''}`} />
          {isCurrentEventFavorite ? 'Favoritado' : 'Favoritar'}
        </Button>

        <Button
          variant="outline"
          onClick={toggleAgenda}
          className={isCurrentEventInAgenda ? 'bg-secondary/10 text-secondary border-secondary' : ''}
        >
          <Plus className={`w-5 h-5 mr-2 ${isCurrentEventInAgenda ? 'fill-secondary' : ''}`} />
          {isCurrentEventInAgenda ? 'Na Agenda' : 'Agendar'}
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

      {/* Botão de IA para criar rota */}
      <div className="mb-6">
        <Button
          onClick={generateAIRoute}
          disabled={isGeneratingRoute}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGeneratingRoute ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Gerando rota personalizada...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Criar rota personalizada com IA
            </>
          )}
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

            {/* Tags do evento */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modal de roteiro da IA */}
      {showItineraryModal && (
        <ItineraryModal 
          events={[event]} 
          onClose={() => setShowItineraryModal(false)}
          isOpen={showItineraryModal}
        />
      )}
    </motion.div>
  );
};

export default EventDetailScreen;