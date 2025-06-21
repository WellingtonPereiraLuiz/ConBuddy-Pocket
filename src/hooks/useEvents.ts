import { useState, useEffect } from 'react';
import { Event } from '../models/types';
import { mockEvents } from '../services/mockData';

export const useEvents = (filter?: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null); // Reset do erro a cada nova busca

      try {
        // Simular atraso de rede
        await new Promise((resolve) => setTimeout(resolve, 500));

        let filteredEvents = [...mockEvents];

        if (filter) {
          const lowerFilter = filter.toLowerCase();
          filteredEvents = filteredEvents.filter(
            (event) =>
              event.title.toLowerCase().includes(lowerFilter) ||
              event.category.toLowerCase().includes(lowerFilter) ||
              event.tags.some((tag) => tag.toLowerCase().includes(lowerFilter))
          );
        }

        setEvents(filteredEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Erro ao carregar eventos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter]);

  const getFeaturedEvents = () => events.filter((event) => event.isFeatured);

  const getEventById = (id: string): Event | undefined =>
    events.find((event) => event.id === id);

  return {
    events,
    loading,
    error,
    getFeaturedEvents,
    getEventById,
  };
};
