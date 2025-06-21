import { useState, useEffect } from 'react';
import { Event } from '../models/types';

export const useAgenda = () => {
  const [agendaEvents, setAgendaEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Carregar agenda do localStorage
    const savedAgenda = localStorage.getItem('conbuddy_agenda');
    if (savedAgenda) {
      try {
        const parsedAgenda = JSON.parse(savedAgenda);
        setAgendaEvents(parsedAgenda);
      } catch (error) {
        console.error('Erro ao carregar agenda:', error);
        localStorage.removeItem('conbuddy_agenda');
      }
    }
  }, []);

  // Salvar agenda no localStorage sempre que a lista mudar
  const saveAgenda = (newAgenda: Event[]) => {
    try {
      localStorage.setItem('conbuddy_agenda', JSON.stringify(newAgenda));
      setAgendaEvents(newAgenda);
    } catch (error) {
      console.error('Erro ao salvar agenda:', error);
    }
  };

  const addToAgenda = (event: Event) => {
    try {
      // Verificar se o evento já não está na agenda
      if (!agendaEvents.some(agendaEvent => agendaEvent.id === event.id)) {
        const newAgenda = [...agendaEvents, event];
        saveAgenda(newAgenda);
      }
    } catch (error) {
      console.error('Erro ao adicionar à agenda:', error);
    }
  };

  const removeFromAgenda = (eventId: string) => {
    try {
      const newAgenda = agendaEvents.filter(event => event.id !== eventId);
      saveAgenda(newAgenda);
    } catch (error) {
      console.error('Erro ao remover da agenda:', error);
    }
  };

  const isInAgenda = (eventId: string) => {
    return agendaEvents.some(event => event.id === eventId);
  };

  // Limpar toda a agenda
  const clearAgenda = () => {
    try {
      localStorage.removeItem('conbuddy_agenda');
      setAgendaEvents([]);
    } catch (error) {
      console.error('Erro ao limpar agenda:', error);
    }
  };

  // Obter próximo evento
  const getNextEvent = () => {
    const now = new Date();
    const upcomingEvents = agendaEvents
      .filter(event => new Date(event.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  };

  // Obter eventos de hoje
  const getTodayEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return agendaEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate >= today && eventDate < tomorrow;
    });
  };

  return { 
    agendaEvents, 
    addToAgenda, 
    removeFromAgenda, 
    isInAgenda, 
    clearAgenda,
    getNextEvent,
    getTodayEvents,
    agendaCount: agendaEvents.length 
  };
};