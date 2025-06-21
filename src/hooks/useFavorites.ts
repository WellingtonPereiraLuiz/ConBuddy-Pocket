import { useState, useEffect } from 'react';
import { Event } from '../models/types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Event[]>([]);

  useEffect(() => {
    // Carregar favoritos do localStorage
    const savedFavorites = localStorage.getItem('conbuddy_favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        localStorage.removeItem('conbuddy_favorites');
      }
    }
  }, []);

  // Salvar favoritos no localStorage sempre que a lista mudar
  const saveFavorites = (newFavorites: Event[]) => {
    try {
      localStorage.setItem('conbuddy_favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const addFavorite = (event: Event) => {
    try {
      // Verificar se o evento já não está nos favoritos
      if (!favorites.some(fav => fav.id === event.id)) {
        const newFavorites = [...favorites, event];
        saveFavorites(newFavorites);
      }
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  };
  
  const removeFavorite = (eventId: string) => {
    try {
      const newFavorites = favorites.filter(fav => fav.id !== eventId);
      saveFavorites(newFavorites);
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const isFavorite = (eventId: string) => {
    return favorites.some(fav => fav.id === eventId);
  };

  // Limpar todos os favoritos
  const clearFavorites = () => {
    try {
      localStorage.removeItem('conbuddy_favorites');
      setFavorites([]);
    } catch (error) {
      console.error('Erro ao limpar favoritos:', error);
    }
  };

  return { 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite, 
    clearFavorites,
    favoritesCount: favorites.length 
  };
};