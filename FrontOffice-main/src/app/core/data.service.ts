import { Injectable, signal } from '@angular/core';

export interface Course {
  id: number;
  title: string;
  category: 'Grammar' | 'Speaking' | 'Business English' | 'Exam Preparation';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  description: string;
  duration: string;
  price: number;
  teacher: string;
  image: string;
  // Additional fields for client view
  thumbnail?: string;
  lessons?: number;
  students?: number;
  createdAt: Date;
}

export interface Event {
  id: number;
  title: string;
  category: 'Workshop' | 'Competition' | 'Webinar' | 'Cultural Event';
  date: Date;
  time: string;
  location: string;
  maxParticipants: number;
  description: string;
  image: string;
  createdAt: Date;
}

export interface Club {
  id: number;
  name: string;
  category: 'Speaking Club' | 'Debate Club' | 'Writing Club' | 'Culture Club';
  schedule: string;
  maxMembers: number;
  description: string;
  image: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Courses mock data
  private coursesSignal = signal<Course[]>([
    {
      id: 1,
      title: 'Business English Masterclass',
      category: 'Business English',
      level: 'B2',
      description: 'Comprehensive business English course covering professional communication, presentations, negotiations, and email writing.',
      duration: '8 weeks',
      price: 199,
      teacher: 'Sarah Johnson',
      image: 'assets/images/course-img-1.jpg',
      thumbnail: 'assets/images/course-img-1.jpg',
      lessons: 32,
      students: 1245,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Grammar Fundamentals',
      category: 'Grammar',
      level: 'A1',
      description: 'Perfect for beginners. Learn essential grammar rules from scratch with interactive exercises.',
      duration: '6 weeks',
      price: 79,
      teacher: 'Michael Chen',
      image: 'assets/images/course-img-2.jpg',
      thumbnail: 'assets/images/course-img-2.jpg',
      lessons: 24,
      students: 892,
      createdAt: new Date('2024-02-01')
    },
    {
      id: 3,
      title: 'IELTS Preparation Advanced',
      category: 'Exam Preparation',
      level: 'C1',
      description: 'Intensive IELTS preparation with practice tests, speaking strategies, and writing techniques.',
      duration: '12 weeks',
      price: 349,
      teacher: 'Emma Wilson',
      image: 'assets/images/course-img-3.jpg',
      thumbnail: 'assets/images/course-img-3.jpg',
      lessons: 48,
      students: 2156,
      createdAt: new Date('2024-02-15')
    },
    {
      id: 4,
      title: 'Conversational English',
      category: 'Speaking',
      level: 'B1',
      description: 'Improve your speaking skills through real-world conversations, role-plays, and discussions.',
      duration: '10 weeks',
      price: 149,
      teacher: 'David Brown',
      image: 'assets/images/course-img-4.jpg',
      thumbnail: 'assets/images/course-img-4.jpg',
      lessons: 40,
      students: 1876,
      createdAt: new Date('2024-03-01')
    },
    {
      id: 5,
      title: 'TOEFL iBT Preparation',
      category: 'Exam Preparation',
      level: 'B2',
      description: 'Complete TOEFL preparation with reading, listening, speaking, and writing sections.',
      duration: '10 weeks',
      price: 299,
      teacher: 'Lisa Anderson',
      image: 'assets/images/course-img-1.jpg',
      thumbnail: 'assets/images/course-img-1.jpg',
      lessons: 45,
      students: 1543,
      createdAt: new Date('2024-03-15')
    },
    {
      id: 6,
      title: 'Professional Writing Skills',
      category: 'Business English',
      level: 'B2',
      description: 'Master professional email writing, reports, proposals, and business documentation.',
      duration: '6 weeks',
      price: 129,
      teacher: 'Robert Taylor',
      image: 'assets/images/course-img-2.jpg',
      thumbnail: 'assets/images/course-img-2.jpg',
      lessons: 24,
      students: 723,
      createdAt: new Date('2024-04-01')
    }
  ]);

  // Events mock data
  private eventsSignal = signal<Event[]>([
    {
      id: 1,
      title: 'English Speaking Competition 2024',
      category: 'Competition',
      date: new Date('2024-06-15'),
      time: '14:00',
      location: 'Main Auditorium',
      maxParticipants: 50,
      description: 'Annual English speaking competition for all levels. Show off your eloquence!',
      image: 'assets/images/course-img-1.jpg',
      createdAt: new Date('2024-05-01')
    },
    {
      id: 2,
      title: 'Webinar: Study Abroad Tips',
      category: 'Webinar',
      date: new Date('2024-06-20'),
      time: '18:00',
      location: 'Online',
      maxParticipants: 200,
      description: 'Learn from successful students about studying in English-speaking countries.',
      image: 'assets/images/course-img-2.jpg',
      createdAt: new Date('2024-05-10')
    },
    {
      id: 3,
      title: 'Cultural Exchange Evening',
      category: 'Cultural Event',
      date: new Date('2024-07-01'),
      time: '19:00',
      location: 'Campus Hall',
      maxParticipants: 100,
      description: 'Experience different cultures through food, music, and presentations.',
      image: 'assets/images/course-img-3.jpg',
      createdAt: new Date('2024-05-15')
    },
    {
      id: 4,
      title: 'Writing Workshop: Creative Expression',
      category: 'Workshop',
      date: new Date('2024-07-10'),
      time: '15:00',
      location: 'Room 201',
      maxParticipants: 30,
      description: 'Improve your creative writing skills in English with expert guidance.',
      image: 'assets/images/course-img-4.jpg',
      createdAt: new Date('2024-05-20')
    },
    {
      id: 5,
      title: 'Debate Championship',
      category: 'Competition',
      date: new Date('2024-07-25'),
      time: '09:00',
      location: 'Conference Center',
      maxParticipants: 40,
      description: 'Test your debate skills against other learners in this exciting competition.',
      image: 'assets/images/course-img-1.jpg',
      createdAt: new Date('2024-06-01')
    }
  ]);

  // Clubs mock data
  private clubsSignal = signal<Club[]>([
    {
      id: 1,
      name: 'Monday Speaking Club',
      category: 'Speaking Club',
      schedule: 'Every Monday, 18:00-19:30',
      maxMembers: 15,
      description: 'Practice conversational English in a friendly, supportive environment.',
      image: 'assets/images/course-img-1.jpg',
      createdAt: new Date('2024-01-01')
    },
    {
      id: 2,
      name: 'Wednesday Debate Club',
      category: 'Debate Club',
      schedule: 'Every Wednesday, 17:00-18:30',
      maxMembers: 12,
      description: 'Develop critical thinking and argumentation skills through debates.',
      image: 'assets/images/course-img-2.jpg',
      createdAt: new Date('2024-01-15')
    },
    {
      id: 3,
      name: 'Friday Writing Circle',
      category: 'Writing Club',
      schedule: 'Every Friday, 16:00-17:30',
      maxMembers: 10,
      description: 'Share your writing and get feedback from peers and mentors.',
      image: 'assets/images/course-img-3.jpg',
      createdAt: new Date('2024-02-01')
    },
    {
      id: 4,
      name: 'Saturday Culture Club',
      category: 'Culture Club',
      schedule: 'Every Saturday, 14:00-16:00',
      maxMembers: 20,
      description: 'Explore English-speaking cultures through movies, music, and discussions.',
      image: 'assets/images/course-img-4.jpg',
      createdAt: new Date('2024-02-15')
    },
    {
      id: 5,
      name: 'Thursday Business English Club',
      category: 'Speaking Club',
      schedule: 'Every Thursday, 19:00-20:30',
      maxMembers: 15,
      description: 'Practice business vocabulary and professional communication.',
      image: 'assets/images/course-img-1.jpg',
      createdAt: new Date('2024-03-01')
    }
  ]);

  // Signals for reactive updates
  courses = this.coursesSignal.asReadonly();
  events = this.eventsSignal.asReadonly();
  clubs = this.clubsSignal.asReadonly();

  // Course CRUD operations
  getCourses(): Course[] {
    return this.coursesSignal();
  }

  getCourseById(id: number): Course | undefined {
    return this.coursesSignal().find(c => c.id === id);
  }

  addCourse(course: Omit<Course, 'id' | 'createdAt'>): Course {
    const newCourse: Course = {
      ...course,
      id: Math.max(...this.coursesSignal().map(c => c.id)) + 1,
      createdAt: new Date()
    };
    this.coursesSignal.update(courses => [...courses, newCourse]);
    return newCourse;
  }

  updateCourse(id: number, course: Partial<Course>): void {
    this.coursesSignal.update(courses => 
      courses.map(c => c.id === id ? { ...c, ...course } : c)
    );
  }

  deleteCourse(id: number): void {
    this.coursesSignal.update(courses => courses.filter(c => c.id !== id));
  }

  // Helper method to convert level code to human-readable label
  getCourseLevelLabel(level: string): string {
    const levelMap: Record<string, string> = {
      'A1': 'Beginner',
      'A2': 'Elementary',
      'B1': 'Intermediate',
      'B2': 'Upper Intermediate',
      'C1': 'Advanced',
      'C2': 'Proficient'
    };
    return levelMap[level] || level;
  }

  // Event CRUD operations
  getEvents(): Event[] {
    return this.eventsSignal();
  }

  getEventById(id: number): Event | undefined {
    return this.eventsSignal().find(e => e.id === id);
  }

  addEvent(event: Omit<Event, 'id' | 'createdAt'>): Event {
    const newEvent: Event = {
      ...event,
      id: Math.max(...this.eventsSignal().map(e => e.id)) + 1,
      createdAt: new Date()
    };
    this.eventsSignal.update(events => [...events, newEvent]);
    return newEvent;
  }

  updateEvent(id: number, event: Partial<Event>): void {
    this.eventsSignal.update(events => 
      events.map(e => e.id === id ? { ...e, ...event } : e)
    );
  }

  deleteEvent(id: number): void {
    this.eventsSignal.update(events => events.filter(e => e.id !== id));
  }

  // Club CRUD operations
  getClubs(): Club[] {
    return this.clubsSignal();
  }

  getClubById(id: number): Club | undefined {
    return this.clubsSignal().find(c => c.id === id);
  }

  addClub(club: Omit<Club, 'id' | 'createdAt'>): Club {
    const newClub: Club = {
      ...club,
      id: Math.max(...this.clubsSignal().map(c => c.id)) + 1,
      createdAt: new Date()
    };
    this.clubsSignal.update(clubs => [...clubs, newClub]);
    return newClub;
  }

  updateClub(id: number, club: Partial<Club>): void {
    this.clubsSignal.update(clubs => 
      clubs.map(c => c.id === id ? { ...c, ...club } : c)
    );
  }

  deleteClub(id: number): void {
    this.clubsSignal.update(clubs => clubs.filter(c => c.id !== id));
  }
}
