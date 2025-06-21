import { useState, useEffect } from 'react';
import { Event } from '../models/types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Event[]>([]);

  useEffect(() => {
    // Carregar favoritos do localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Adicionar tratamento de erro
  const addFavorite = (event: Event) => {
    try {
      const newFavorites = [...favorites, event];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  };
  
  const removeFavorite = (eventId: string) => {
    try {
      const newFavorites = favorites.filter(fav => fav.id !== eventId);
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const isFavorite = (eventId: string) => {
    return favorites.some(fav => fav.id === eventId);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
};