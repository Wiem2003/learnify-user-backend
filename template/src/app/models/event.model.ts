/** Event category values used in forms and API */
export type EventCategory = 'Workshop' | 'Competition' | 'Webinar' | 'Cultural Event';

export interface Event {
  id: number;
  title: string;
  category: EventCategory;
  /** ISO date string or Date from API */
  date: string | Date;
  time: string;
  location: string;
  maxParticipants: number;
  description: string;
  image: string;
  /** ISO date string or Date from API */
  createdAt?: string | Date;
}

/** Payload for creating an event (no id, no createdAt) */
export type EventCreate = Omit<Event, 'id' | 'createdAt'>;

/** Payload for updating an event (partial, no id) */
export type EventUpdate = Partial<Omit<Event, 'id'>>;
