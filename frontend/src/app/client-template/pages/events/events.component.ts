import { Component } from '@angular/core';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  image: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  standalone: false,
})
export class EventsComponent {
  events: Event[] = [
    {
      id: 1,
      title: 'Language Exchange Meetup',
      description: 'Meet native speakers and practice your skills',
      date: '2024-03-15',
      time: '6:00 PM',
      location: 'Online / Café Central',
      participants: 32,
      image: 'assets/images/course-img-1.jpg',
    },
    {
      id: 2,
      title: 'Pronunciation Workshop',
      description: 'Improve your accent with expert guidance',
      date: '2024-03-18',
      time: '4:00 PM',
      location: 'Room 101',
      participants: 18,
      image: 'assets/images/course-img-2.jpg',
    },
    {
      id: 3,
      title: 'Cultural Night',
      description: 'Discover traditions and customs',
      date: '2024-03-22',
      time: '7:00 PM',
      location: 'Main Hall',
      participants: 50,
      image: 'assets/images/course-img-3.jpg',
    },
  ];

  joinEvent(event: Event): void {
    console.log('Joined event:', event.title);
  }

  viewEvent(event: Event): void {
    console.log('View event:', event.title);
  }
}
