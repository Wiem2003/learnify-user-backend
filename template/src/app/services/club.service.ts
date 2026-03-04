import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Club, ClubCreate, ClubUpdate } from '../models/club.model';
import { DataService } from '../core/data.service';

@Injectable({ providedIn: 'root' })
export class ClubService {
  constructor(private dataService: DataService) {}

  private toClub(c: { id: number; name: string; category: string; schedule: string; maxMembers: number; description: string; image: string; createdAt: Date }): Club {
    return {
      id: c.id,
      name: c.name,
      category: c.category as Club['category'],
      schedule: c.schedule,
      maxMembers: c.maxMembers,
      description: c.description,
      image: c.image,
      createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    };
  }

  /** Liste des clubs (données mock depuis DataService) */
  getAll(): Observable<Club[]> {
    const clubs = this.dataService.getClubs();
    return of(clubs.map((c) => this.toClub(c)));
  }

  /** Détail d'un club */
  getById(id: number): Observable<Club> {
    const club = this.dataService.getClubById(id);
    if (!club) {
      return throwError(() => new Error('Club not found'));
    }
    return of(this.toClub(club));
  }

  /** Créer un club */
  create(payload: ClubCreate): Observable<Club> {
    const created = this.dataService.addClub({
      name: payload.name,
      category: payload.category,
      schedule: payload.schedule,
      maxMembers: payload.maxMembers,
      description: payload.description,
      image: payload.image,
    });
    return of(this.toClub(created));
  }

  /** Modifier un club */
  update(id: number, payload: ClubUpdate): Observable<Club> {
    const raw: Record<string, unknown> = { ...payload };
    if (payload.createdAt !== undefined) {
      raw['createdAt'] = typeof payload.createdAt === 'string' ? new Date(payload.createdAt) : payload.createdAt;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
this.dataService.updateClub(id, raw as any);
    const updated = this.dataService.getClubById(id);
    return of(this.toClub(updated!));
  }

  /** Supprimer un club */
  delete(id: number): Observable<void> {
    this.dataService.deleteClub(id);
    return of(undefined);
  }
}
