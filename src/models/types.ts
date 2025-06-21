export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  interests?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  locationDetails?: {
    lat: number;
    lng: number;
    name: string;
    address: string;
  };
  startDate: string;
  endDate: string;
  category: string;
  tags: string[];
  isFeatured?: boolean;
  speakers?: Speaker[];
}

export interface Speaker {
  id: string;
  name: string;
  bio: string;
  image: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'event' | 'system' | 'alert';
  eventId?: string;
}

export interface UserInterest {
  id: string;
  name: string;
  icon: string;
}

export interface MapMarker {
  id: string;
  title: string;
  description?: string;
  position: [number, number];
  type: 'stage' | 'booth' | 'food' | 'restroom' | 'exit' | 'info';
}

export interface EventComment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  timestamp: string;
  likes: number;
}