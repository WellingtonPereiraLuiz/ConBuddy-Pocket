import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useAgenda } from '../hooks/useAgenda';

const AgendaScreen = () => {
  const { agendaEvents } = useAgenda();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold mb-6">Minha Agenda</h1>

      <div className="space-y-4">
        {agendaEvents.length > 0 ? (
          agendaEvents.map(event => (
            <div key={event.id} className="card p-4 flex items-center gap-4">
              <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-bold">{event.title}</h3>
                <p className="text-sm text-text-secondary">
                  {event.location} - {new Date(event.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-secondary text-center py-8">
            Você ainda não adicionou eventos à sua agenda.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AgendaScreen;