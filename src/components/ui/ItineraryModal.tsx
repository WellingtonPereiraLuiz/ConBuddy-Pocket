import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Event } from '../../models/types';
import { formatDate } from '../../services/mockData';

interface ItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
}

export const ItineraryModal = ({ isOpen, onClose, events }: ItineraryModalProps) => {
  if (!isOpen) return null;

  const suggestedItinerary = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-card rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Seu Roteiro Personalizado</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {suggestedItinerary.map((event, index) => (
            <div key={event.id} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-medium">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-text-secondary">{event.location}</p>
                <p className="text-sm text-primary mt-1">
                  {formatDate(event.startDate, 'HH:mm')} - {formatDate(event.endDate, 'HH:mm')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/10 rounded-lg">
          <h3 className="font-medium text-primary mb-2">Dicas da IA</h3>
          <ul className="text-sm space-y-2">
            <li>• Chegue com 15 minutos de antecedência em cada evento</li>
            <li>• Faça pausas de 30 minutos entre eventos longos</li>
            <li>• Priorize os eventos mais populares no início do dia</li>
            <li>• Mantenha-se hidratado e faça refeições nos intervalos sugeridos</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};
