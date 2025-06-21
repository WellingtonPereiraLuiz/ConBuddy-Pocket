import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAgenda } from '../hooks/useAgenda';
import { formatDate } from '../services/mockData';
import { Button } from '../components/ui/Button';

const AgendaScreen = () => {
  const { agendaEvents, removeFromAgenda } = useAgenda();

  // Função para calcular dias restantes
  const getDaysUntilEvent = (startDate: string) => {
    const eventDate = new Date(startDate);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Função para obter texto da contagem regressiva
  const getCountdownText = (days: number) => {
    if (days < 0) return 'Evento finalizado';
    if (days === 0) return 'Hoje!';
    if (days === 1) return 'Amanhã';
    if (days <= 7) return `${days} dias`;
    if (days <= 30) return `${days} dias`;
    return `${Math.ceil(days / 30)} ${Math.ceil(days / 30) === 1 ? 'mês' : 'meses'}`;
  };

  // Função para obter cor baseada na proximidade do evento
  const getCountdownColor = (days: number) => {
    if (days < 0) return 'text-gray-500';
    if (days === 0) return 'text-success font-bold';
    if (days === 1) return 'text-warning font-bold';
    if (days <= 7) return 'text-accent font-semibold';
    return 'text-primary';
  };

  // Ordenar eventos por data
  const sortedEvents = [...agendaEvents].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minha Agenda</h1>
          <p className="text-text-secondary text-sm mt-1">
            {agendaEvents.length} {agendaEvents.length === 1 ? 'evento agendado' : 'eventos agendados'}
          </p>
        </div>
        {agendaEvents.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-text-secondary">Próximo evento</p>
            <p className="text-sm font-medium text-primary">
              {sortedEvents.length > 0 && getCountdownText(getDaysUntilEvent(sortedEvents[0].startDate))}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event, index) => {
            const daysUntilEvent = getDaysUntilEvent(event.startDate);
            const countdownText = getCountdownText(daysUntilEvent);
            const countdownColor = getCountdownColor(daysUntilEvent);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-4 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  {/* Número sequencial */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>

                  {/* Conteúdo do evento */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <Link to={`/event/${event.id}`}>
                          <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
                            {event.title}
                          </h3>
                        </Link>
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-full text-xs mt-1">
                          {event.category}
                        </span>
                      </div>
                      
                      {/* Contagem regressiva */}
                      <div className="text-right ml-4">
                        <div className={`text-sm ${countdownColor}`}>
                          {countdownText}
                        </div>
                        {daysUntilEvent >= 0 && (
                          <div className="flex items-center text-xs text-text-secondary mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(event.startDate, 'HH:mm')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informações do evento */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-text-secondary">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>
                          {formatDate(event.startDate, 'dd MMM yyyy')} - {formatDate(event.endDate, 'dd MMM yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-text-secondary">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
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

                    {/* Ações */}
                    <div className="flex items-center justify-between">
                      <Link 
                        to={`/event/${event.id}`}
                        className="text-primary text-sm font-medium hover:underline flex items-center"
                      >
                        Ver detalhes
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                      
                      <button
                        onClick={() => removeFromAgenda(event.id)}
                        className="text-error text-sm hover:bg-error/10 px-2 py-1 rounded transition-colors flex items-center opacity-0 group-hover:opacity-100"
                        title="Remover da agenda"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full inline-flex mx-auto mb-4">
              <Calendar className="w-12 h-12 text-text-secondary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Sua agenda está vazia</h2>
            <p className="text-text-secondary mb-6 max-w-md mx-auto">
              Você ainda não adicionou eventos à sua agenda. Explore eventos e adicione-os para criar seu cronograma personalizado!
            </p>
            <Link to="/">
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Explorar eventos
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Dicas da agenda */}
      {agendaEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card p-4 bg-primary/5 border-primary/20"
        >
          <h3 className="font-bold text-primary mb-2 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Dicas para sua agenda
          </h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Chegue com 15 minutos de antecedência em cada evento</li>
            <li>• Verifique a localização dos eventos no mapa</li>
            <li>• Configure notificações para não perder nenhum evento</li>
            <li>• Mantenha-se hidratado e faça pausas entre eventos longos</li>
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AgendaScreen;