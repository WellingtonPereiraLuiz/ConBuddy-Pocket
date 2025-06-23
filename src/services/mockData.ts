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

// Mock events - Expandido para 15 eventos conforme solicitado
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
  },
  // Novos eventos adicionados para completar os 15 solicitados
  {
    id: '6',
    title: 'TechCrunch Disrupt São Paulo',
    description: 'O maior evento de tecnologia e startups da América Latina, com palestras de grandes nomes da tecnologia mundial.',
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'WTC São Paulo',
    locationDetails: {
      lat: -23.6134,
      lng: -46.6978,
      name: 'WTC São Paulo',
      address: 'Av. das Nações Unidas, 12551 - Brooklin Novo, São Paulo - SP'
    },
    startDate: generateDate(0, 45),
    endDate: generateDate(0, 47),
    category: 'Tecnologia',
    tags: ['tecnologia', 'startups', 'inovação', 'empreendedorismo'],
    isFeatured: true
  },
  {
    id: '7',
    title: 'Festival de Música Eletrônica Geek',
    description: 'Uma experiência única que combina música eletrônica com cultura geek, featuring DJs que tocam remixes de trilhas sonoras de games e animes.',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Allianz Parque',
    locationDetails: {
      lat: -23.5273,
      lng: -46.6814,
      name: 'Allianz Parque',
      address: 'Av. Francisco Matarazzo, 1705 - Água Branca, São Paulo - SP'
    },
    startDate: generateDate(0, 15),
    endDate: generateDate(0, 16),
    category: 'Música',
    tags: ['música', 'eletrônica', 'games', 'anime'],
    isFeatured: false
  },
  {
    id: '8',
    title: 'Cosplay Championship Brasil',
    description: 'O maior campeonato de cosplay do Brasil, com competições em diversas categorias e premiações incríveis.',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Centro de Convenções Frei Caneca',
    locationDetails: {
      lat: -23.5505,
      lng: -46.6333,
      name: 'Centro de Convenções Frei Caneca',
      address: 'Rua Frei Caneca, 569 - Consolação, São Paulo - SP'
    },
    startDate: generateDate(0, 25),
    endDate: generateDate(0, 26),
    category: 'Cosplay',
    tags: ['cosplay', 'competição', 'anime', 'games'],
    isFeatured: false
  },
  {
    id: '9',
    title: 'Retro Gaming Expo',
    description: 'Uma viagem nostálgica pelos clássicos dos videogames, com consoles antigos, competições e encontro com desenvolvedores veteranos.',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Shopping Eldorado',
    locationDetails: {
      lat: -23.5631,
      lng: -46.6919,
      name: 'Shopping Eldorado',
      address: 'Av. Rebouças, 3970 - Pinheiros, São Paulo - SP'
    },
    startDate: generateDate(0, 8),
    endDate: generateDate(0, 10),
    category: 'Games',
    tags: ['retro', 'games', 'nostalgia', 'arcade'],
    isFeatured: false
  },
  {
    id: '10',
    title: 'Workshop de Desenvolvimento de Jogos Indie',
    description: 'Aprenda a criar seus próprios jogos independentes com desenvolvedores experientes e ferramentas modernas.',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Campus da USP',
    locationDetails: {
      lat: -23.5558,
      lng: -46.7319,
      name: 'Universidade de São Paulo',
      address: 'Av. Prof. Luciano Gualberto, 908 - Butantã, São Paulo - SP'
    },
    startDate: generateDate(0, 12),
    endDate: generateDate(0, 14),
    category: 'Workshop',
    tags: ['desenvolvimento', 'indie', 'games', 'programação'],
    isFeatured: false
  },
  {
    id: '11',
    title: 'Encontro de Colecionadores de Cards',
    description: 'O maior encontro de colecionadores de trading cards do Brasil, com torneios, trocas e lançamentos exclusivos.',
    image: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Centro de Convenções Rebouças',
    locationDetails: {
      lat: -23.5590,
      lng: -46.6902,
      name: 'Centro de Convenções Rebouças',
      address: 'Av. Dr. Enéas Carvalho de Aguiar, 23 - Cerqueira César, São Paulo - SP'
    },
    startDate: generateDate(0, 18),
    endDate: generateDate(0, 19),
    category: 'Colecionáveis',
    tags: ['cards', 'colecionáveis', 'torneio', 'trading'],
    isFeatured: false
  },
  {
    id: '12',
    title: 'Feira de Quadrinhos Independentes',
    description: 'Descubra novos talentos da arte sequencial brasileira, com artistas independentes, fanzines e obras autorais.',
    image: 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Biblioteca Mário de Andrade',
    locationDetails: {
      lat: -23.5431,
      lng: -46.6395,
      name: 'Biblioteca Mário de Andrade',
      address: 'Rua da Consolação, 94 - República, São Paulo - SP'
    },
    startDate: generateDate(0, 35),
    endDate: generateDate(0, 36),
    category: 'Quadrinhos',
    tags: ['quadrinhos', 'independente', 'arte', 'fanzine'],
    isFeatured: false
  },
  {
    id: '13',
    title: 'Maratona de Filmes de Terror Cult',
    description: 'Uma maratona de 24 horas com os melhores filmes de terror cult e B-movies, com debates e análises.',
    image: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Cine Belas Artes',
    locationDetails: {
      lat: -23.5505,
      lng: -46.6333,
      name: 'Cine Belas Artes',
      address: 'Rua da Consolação, 2423 - Consolação, São Paulo - SP'
    },
    startDate: generateDate(0, 40),
    endDate: generateDate(0, 41),
    category: 'Cinema',
    tags: ['terror', 'cult', 'cinema', 'maratona'],
    isFeatured: false
  },
  {
    id: '14',
    title: 'Encontro de Streamers e Content Creators',
    description: 'Networking e workshops para criadores de conteúdo digital, streamers e influenciadores da comunidade geek.',
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Google Campus São Paulo',
    locationDetails: {
      lat: -23.5505,
      lng: -46.6333,
      name: 'Google Campus São Paulo',
      address: 'Rua Bela Cintra, 756 - Consolação, São Paulo - SP'
    },
    startDate: generateDate(0, 28),
    endDate: generateDate(0, 29),
    category: 'Digital',
    tags: ['streaming', 'conteúdo', 'influencer', 'networking'],
    isFeatured: false
  },
  {
    id: '15',
    title: 'Festival de Robótica e IA',
    description: 'Explore o futuro da tecnologia com demonstrações de robôs, inteligência artificial e automação.',
    image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    location: 'Pavilhão da Bienal',
    locationDetails: {
      lat: -23.5873,
      lng: -46.6573,
      name: 'Pavilhão da Bienal',
      address: 'Av. Paulista, 1578 - Bela Vista, São Paulo - SP'
    },
    startDate: generateDate(0, 50),
    endDate: generateDate(0, 52),
    category: 'Tecnologia',
    tags: ['robótica', 'ia', 'automação', 'futuro'],
    isFeatured: false
  }
];

// Mock notifications - Expandidas para 5 notificações conforme solicitado
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user123',
    type: 'event',
    title: 'Evento Começando em Breve!',
    message: 'A Comic Con Experience 2025 começa em 2 horas! Não esqueça de verificar sua agenda e chegar com antecedência.',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min atrás
    isRead: false,
    eventId: '1'
  },
  {
    id: '2',
    userId: 'user123',
    type: 'ai',
    title: '🤖 Rota Personalizada Criada',
    message: 'Sua IA criou uma rota otimizada para os eventos de hoje baseada nos seus interesses. Confira sua agenda para ver as recomendações personalizadas!',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1h atrás
    isRead: false,
  },
  {
    id: '3',
    userId: 'user123',
    type: 'alert',
    title: '⚠️ Alteração de Horário Importante',
    message: 'O painel "Futuro dos Games" foi adiado para 16h devido a problemas técnicos. Sua agenda foi atualizada automaticamente.',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2h atrás
    isRead: true,
  },
  {
    id: '4',
    userId: 'user123',
    type: 'social',
    title: '👥 Amigos Participando',
    message: '5 dos seus amigos marcaram presença no Brasil Game Show 2025. Que tal se encontrarem lá? Veja quem vai estar presente!',
    timestamp: new Date(Date.now() - 14400000).toISOString(), // 4h atrás
    isRead: false,
    eventId: '2'
  },
  {
    id: '5',
    userId: 'user123',
    type: 'system',
    title: '💡 Dica Personalizada',
    message: 'Baseado nos seus interesses em RPG e Games, recomendamos o evento "RPG Con Brasil" que acontece na próxima semana. Quer adicionar à sua agenda?',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    isRead: true,
    eventId: '5'
  }
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

// Map markers for São Paulo - Centralizados conforme solicitado
export const mapMarkers: MapMarker[] = [
  {
    id: 'm1',
    title: 'São Paulo Expo',
    description: 'Local da Comic Con Experience 2025',
    position: [-23.6267, -46.6718],
    type: 'stages'
  },
  {
    id: 'm2',
    title: 'Expo Center Norte',
    description: 'Local do Brasil Game Show 2025',
    position: [-23.5101, -46.6144],
    type: 'booths'
  },
  {
    id: 'm3',
    title: 'Distrito Anhembi',
    description: 'Local do Anime Friends 2025',
    position: [-23.5155, -46.6371],
    type: 'food'
  },
  {
    id: 'm4',
    title: 'Centro Cultural São Paulo',
    description: 'Feira do Livro Fantástico',
    position: [-23.5707, -46.6395],
    type: 'info'
  },
  {
    id: 'm5',
    title: 'Clube Homs',
    description: 'RPG Con Brasil',
    position: [-23.5665, -46.6508],
    type: 'restrooms'
  },
  {
    id: 'm6',
    title: 'WTC São Paulo',
    description: 'TechCrunch Disrupt São Paulo',
    position: [-23.6134, -46.6978],
    type: 'exits'
  }
];

// Format a date
export const formatDate = (dateString: string, formatStr = 'dd MMM yyyy, HH:mm') => {
  const date = new Date(dateString);
  return format(date, formatStr, { locale: ptBR });
};