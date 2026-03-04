import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Event, EventCreate, EventUpdate } from '../models/event.model';
import { DataService } from '../core/data.service';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private dataService: DataService) {}

  private toEvent(e: { id: number; title: string; category: string; date: Date; time: string; location: string; maxParticipants: number; description: string; image: string; createdAt: Date }): Event {
    return {
      id: e.id,
      title: e.title,
      category: e.category as Event['category'],
      date: e.date instanceof Date ? e.date.toISOString().slice(0, 10) : e.date,
      time: e.time,
      location: e.location,
      maxParticipants: e.maxParticipants,
      description: e.description,
      image: e.image,
      createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
    };
  }

  /** Liste des événements (données mock depuis DataService) */
  getAll(): Observable<Event[]> {
    const events = this.dataService.getEvents();
    return of(events.map((e) => this.toEvent(e)));
  }

  getById(id: number): Observable<Event> {
    const ev = this.dataService.getEventById(id);
    if (!ev) {
      return throwError(() => new Error('Event not found'));
    }
    return of(this.toEvent(ev));
  }

  create(payload: EventCreate): Observable<Event> {
    const created = this.dataService.addEvent({
      title: payload.title,
      category: payload.category,
      date: typeof payload.date === 'string' ? new Date(payload.date) : payload.date,
      time: payload.time,
      location: payload.location,
      maxParticipants: payload.maxParticipants,
      description: payload.description,
      image: payload.image,
    });
    return of(this.toEvent(created));
  }

  update(id: number, payload: EventUpdate): Observable<Event> {
    const toUpdate: Partial<{ title: string; category: string; date: Date; time: string; location: string; maxParticipants: number; description: string; image: string }> = {};
    if (payload.title !== undefined) toUpdate.title = payload.title;
    if (payload.category !== undefined) toUpdate.category = payload.category;
    if (payload.date !== undefined) toUpdate.date = typeof payload.date === 'string' ? new Date(payload.date) : payload.date;
    if (payload.time !== undefined) toUpdate.time = payload.time;
    if (payload.location !== undefined) toUpdate.location = payload.location;
    if (payload.maxParticipants !== undefined) toUpdate.maxParticipants = payload.maxParticipants;
    if (payload.description !== undefined) toUpdate.description = payload.description;
    if (payload.image !== undefined) toUpdate.image = payload.image;
    this.dataService.updateEvent(id, toUpdate as any);
    const updated = this.dataService.getEventById(id);
    return of(this.toEvent(updated!));
  }

  delete(id: number): Observable<void> {
    this.dataService.deleteEvent(id);
    return of(undefined);
  }
}
