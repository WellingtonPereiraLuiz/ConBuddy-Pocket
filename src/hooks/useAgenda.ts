import { useState, useEffect } from 'react';
import { Event } from '../models/types';

export const useAgenda = () => {
  const [agendaEvents, setAgendaEvents] = useState<Event[]>([]);

  useEffect(() => {
    const savedAgenda = localStorage.getItem('agenda');
    if (savedAgenda) {
      setAgendaEvents(JSON.parse(savedAgenda));
    }
  }, []);

  const addToAgenda = (event: Event) => {
    const newAgenda = [...agendaEvents, event];
    setAgendaEvents(newAgenda);
    localStorage.setItem('agenda', JSON.stringify(newAgenda));
  };

  const removeFromAgenda = (eventId: string) => {
    const newAgenda = agendaEvents.filter(event => event.id !== eventId);
    setAgendaEvents(newAgenda);
    localStorage.setItem('agenda', JSON.stringify(newAgenda));
  };

  const isInAgenda = (eventId: string) => {
    return agendaEvents.some(event => event.id === eventId);
  };

  return { agendaEvents, addToAgenda, removeFromAgenda, isInAgenda };
};