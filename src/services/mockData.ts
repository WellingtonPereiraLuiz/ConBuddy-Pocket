import { Event, Notification, UserInterest, MapMarker } from '../models/types';
import { format, addHours, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Helper to generate dates
const now = new Date();
const generateDate = (hoursToAdd: number, daysToAdd = 0) => {
  const date = new Date(now);
  date.setHours(date.getHours() + hoursToAdd);
  date.setDate(date.getDate() + daysToAdd);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

// Mock events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Comic Con Experience 2025',
    description: 'O maior festival de cultura pop do Brasil está de volta com atrações incríveis, painéis exclusivos e os maiores nomes do entretenimento mundial.',
    image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'São Paulo Expo',
    locationDetails: {
      lat: -23.6267,
      lng: -46.6718,
      name: 'São Paulo Expo',
      address: 'Rodovia dos Imigrantes, 1,5 km - Vila Água Funda, São Paulo - SP'
    },
    startDate: generateDate(0, 10),
    endDate: generateDate(0, 14),
    category: 'Convenção',
    tags: ['comics', 'cosplay', 'cinema', 'games'],
    isFeatured: true,
    speakers: [
      {
        id: 's1',
        name: 'Chris Evans',
        bio: 'Ator americano, conhecido por interpretar o Capitão América no MCU.',
        image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        socialMedia: {
          twitter: '@ChrisEvans',
          instagram: '@chrisevans'
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Brasil Game Show 2025',
    description: 'A maior feira de games da América Latina com lançamentos exclusivos, torneios e encontro com desenvolvedores.',
    image: 'https://images.pexels.com/photos/159393/gamepad-video-game-controller-game-controller-controller-159393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Expo Center Norte',
    locationDetails: {
      lat: -23.5101,
      lng: -46.6144,
      name: 'Expo Center Norte',
      address: 'Rua José Bernardo Pinto, 333 - Vila Guilherme, São Paulo - SP'
    },
    startDate: generateDate(0, 30),
    endDate: generateDate(0, 35),
    category: 'Games',
    tags: ['games', 'esports', 'tecnologia'],
    isFeatured: true
  },
  {
    id: '3',
    title: 'Anime Friends 2025',
    description: 'O maior evento de anime e cultura japonesa do Brasil, com cosplay, shows, concursos e muito mais.',
    image: 'https://images.pexels.com/photos/1049622/pexels-photo-1049622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Distrito Anhembi',
    locationDetails: {
      lat: -23.5155,
      lng: -46.6371,
      name: 'Distrito Anhembi',
      address: 'Av. Olavo Fontoura, 1209 - Santana, São Paulo - SP'
    },
    startDate: generateDate(0, 60),
    endDate: generateDate(0, 63),
    category: 'Anime',
    tags: ['anime', 'cosplay', 'cultura japonesa'],
    isFeatured: false
  },
  {
    id: '4',
    title: 'Feira do Livro Fantástico',
    description: 'Um evento dedicado à literatura fantástica, com autores nacionais e internacionais, lançamentos, palestras e oficinas.',
    image: 'https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Centro Cultural São Paulo',
    locationDetails: {
      lat: -23.5707,
      lng: -46.6395,
      name: 'Centro Cultural São Paulo',
      address: 'Rua Vergueiro, 1000 - Liberdade, São Paulo - SP'
    },
    startDate: generateDate(0, 5),
    endDate: generateDate(0, 7),
    category: 'Literatura',
    tags: ['livros', 'fantasia', 'ficção científica'],
    isFeatured: false
  },
  {
    id: '5',
    title: 'RPG Con Brasil',
    description: 'O maior evento dedicado a jogos de RPG do Brasil, com mesas de jogo, palestras, workshops e lançamentos exclusivos.',
    image: 'https://images.pexels.com/photos/6918867/pexels-photo-6918867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Clube Homs',
    locationDetails: {
      lat: -23.5665,
      lng: -46.6508,
      name: 'Clube Homs',
      address: 'Av. Paulista, 735 - Bela Vista, São Paulo - SP'
    },
    startDate: generateDate(0, 20),
    endDate: generateDate(0, 22),
    category: 'RPG',
    tags: ['rpg', 'boardgames', 'jogos de mesa'],
    isFeatured: false
  }
];

// Mock notifications
export const mockNotifications = [
  {
    id: '1',
    type: 'event',
    title: 'Evento Começando em Breve',
    message: 'A palestra "React Native na Prática" começa em 30 minutos!',
    timestamp: new Date(Date.now() + 1800000).toISOString(),
    isRead: false,
  },
  {
    id: '2',
    type: 'alert',
    title: 'Alteração de Horário',
    message: 'O workshop de TypeScript foi adiado para 14h. Atualize sua agenda!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
  },
  {
    id: '3',
    type: 'info',
    title: 'Nova Palestra Adicionada',
    message: 'Uma nova palestra sobre Web3 foi adicionada à programação.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
  },
];

// User interests
export const userInterests: UserInterest[] = [
  { id: '1', name: 'Comics', icon: 'book-open' },
  { id: '2', name: 'Games', icon: 'gamepad' },
  { id: '3', name: 'Anime', icon: 'tv' },
  { id: '4', name: 'Cosplay', icon: 'user' },
  { id: '5', name: 'Cinema', icon: 'film' },
  { id: '6', name: 'Sci-Fi', icon: 'zap' },
  { id: '7', name: 'RPG', icon: 'dice' },
  { id: '8', name: 'Fantasy', icon: 'wand' }
];

// Map markers for an event
export const mapMarkers: MapMarker[] = [
  {
    id: 'm1',
    title: 'Palco Principal',
    description: 'Palco onde acontecem as principais atrações',
    position: [-23.6267, -46.6718],
    type: 'stage'
  },
  {
    id: 'm2',
    title: 'Área de Games',
    description: 'Espaço dedicado a jogos eletrônicos e competições',
    position: [-23.6270, -46.6722],
    type: 'booth'
  },
  {
    id: 'm3',
    title: 'Praça de Alimentação',
    description: 'Diversos restaurantes e opções de comida',
    position: [-23.6265, -46.6730],
    type: 'food'
  },
  {
    id: 'm4',
    title: 'Banheiros',
    position: [-23.6260, -46.6725],
    type: 'restroom'
  },
  {
    id: 'm5',
    title: 'Saída de Emergência',
    position: [-23.6272, -46.6735],
    type: 'exit'
  },
  {
    id: 'm6',
    title: 'Centro de Informações',
    description: 'Tire suas dúvidas e pegue o mapa do evento',
    position: [-23.6268, -46.6710],
    type: 'info'
  }
];

// Format a date
export const formatDate = (dateString: string, formatStr = 'dd MMM yyyy, HH:mm') => {
  const date = new Date(dateString);
  return format(date, formatStr, { locale: ptBR });
};