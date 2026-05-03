import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidsGameService } from '../services/kids-game.service';
import { GameQuestion } from '../models/kids-game.models';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-kids-game',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './kids-game.component.html',
  styleUrls: ['./kids-game.component.scss']
})
export class KidsGameComponent implements OnInit {
  selectedCategory: string | null = null;
  selectedGame: any = null;
  currentQuestionIndex = 0;
  score = 0;
  gameStarted = false;
  gameFinished = false;
  loading = false;
  showGamesList = false;
  availableGames: any[] = [];
  
  questions: any[] = [];
  currentQuestion: any = null;
  shuffledAnswers: string[] = [];
  selectedAnswer: string | null = null;
  showFeedback = false;
  isCorrect = false;
  
  showStarExplosion = false;
  showConfetti = false;
  showErrorShake = false;
  starsEarned = 0;
  
  // Audio elements
  private correctSound: HTMLAudioElement | null = null;
  private wrongSound: HTMLAudioElement | null = null;
  private clickSound: HTMLAudioElement | null = null;
  
  categories = [
    {
      id: 'animals',
      name: 'Animals',
      icon: '🦁',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Learn about cute animals!'
    },
    {
      id: 'colors',
      name: 'Colors',
      icon: '🌈',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Discover beautiful colors!'
    },
    {
      id: 'numbers',
      name: 'Numbers',
      icon: '🔢',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Count and have fun!'
    }
  ];

  constructor(
    private router: Router,
    private kidsGameService: KidsGameService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.initializeSounds();
  }

  initializeSounds(): void {
    // Initialize audio elements with error handling
    try {
      this.correctSound = new Audio();
      this.correctSound.src = 'assets/sounds/correct.mp3';
      this.correctSound.volume = 0.5;
      this.correctSound.load();
      this.correctSound.onerror = () => console.log('Correct sound not found');

      this.wrongSound = new Audio();
      this.wrongSound.src = 'assets/sounds/wrong.mp3';
      this.wrongSound.volume = 0.5;
      this.wrongSound.load();
      this.wrongSound.onerror = () => console.log('Wrong sound not found');

      this.clickSound = new Audio();
      this.clickSound.src = 'assets/sounds/click.mp3';
      this.clickSound.volume = 0.3;
      this.clickSound.load();
      this.clickSound.onerror = () => console.log('Click sound not found');
    } catch (error) {
      console.log('Audio initialization error:', error);
    }
  }

  loadCategories(): void {
    this.kidsGameService.getAllCategories().subscribe({
      next: (categories) => {
        // Map backend categories to frontend format
        this.categories = categories.map(cat => ({
          id: cat.name.toLowerCase(),
          name: cat.name,
          icon: cat.icon,
          gradient: `linear-gradient(135deg, ${cat.color} 0%, ${this.adjustColor(cat.color)} 100%)`,
          description: cat.description || `Learn about ${cat.name}!`
        }));
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Keep default categories if loading fails
      }
    });
  }

  adjustColor(color: string): string {
    // Darken the color for gradient effect
    return color;
  }

  selectCategory(category: string): void {
    this.playSound('click');
    this.selectedCategory = category;
    this.showGamesList = true;
    this.loadGamesForCategory();
  }

  loadGamesForCategory(): void {
    if (!this.selectedCategory) return;
    
    this.loading = true;
    // Find category by name
    this.kidsGameService.getAllCategories().subscribe({
      next: (categories) => {
        const category = categories.find(c => c.name.toLowerCase() === this.selectedCategory);
        if (category && category.id) {
          this.loadAvailableGames(category.id);
        } else {
          console.warn('Category not found:', this.selectedCategory);
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  loadAvailableGames(categoryId: number): void {
    this.kidsGameService.getPublishedGamesByCategory(categoryId).subscribe({
      next: (games) => {
        this.availableGames = games;
        this.loading = false;
        if (games.length === 0) {
          alert('No games available for this category yet. Please create games in the admin panel.');
        }
      },
      error: (error) => {
        console.error('Error loading games:', error);
        alert('Error loading games. Please check if the backend is running.');
        this.loading = false;
      }
    });
  }

  selectGame(game: any): void {
    this.playSound('click');
    this.selectedGame = game;
    this.loadQuestions();
  }

  loadQuestions(): void {
    if (!this.selectedGame) return;
    
    this.loading = true;
    this.kidsGameService.getQuestionsByGame(this.selectedGame.id).subscribe({
      next: (questions) => {
        this.questions = this.shuffleArray(questions.map(q => ({
          word: q.correctAnswer,
          image: q.imageEmoji || '❓',
          wrongAnswers: q.options?.filter(opt => opt !== q.correctAnswer) || []
        })));
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.starsEarned = 0;
        this.gameStarted = true;
        this.gameFinished = false;
        this.showGamesList = false;
        this.loading = false;
        this.loadCurrentQuestion();
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.loading = false;
      }
    });
  }

  loadCurrentQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.prepareAnswers();
      this.selectedAnswer = null;
      this.showFeedback = false;
    } else {
      this.finishGame();
    }
  }

  prepareAnswers(): void {
    if (!this.currentQuestion) return;
    
    const answers = [
      this.currentQuestion.word,
      ...this.currentQuestion.wrongAnswers
    ];
    this.shuffledAnswers = this.shuffleArray(answers);
  }

  selectAnswer(answer: string): void {
    if (this.showFeedback) return;
    
    this.selectedAnswer = answer;
    this.isCorrect = answer === this.currentQuestion?.word;
    this.showFeedback = true;
    
    if (this.isCorrect) {
      this.score++;
      this.playCorrectAnimation();
      this.playSound('correct');
    } else {
      this.playErrorAnimation();
      this.playSound('wrong');
      this.vibrateDevice();
    }
    
    setTimeout(() => {
      this.currentQuestionIndex++;
      this.loadCurrentQuestion();
    }, 2000);
  }

  playCorrectAnimation(): void {
    this.showStarExplosion = true;
    this.showConfetti = true;
    setTimeout(() => {
      this.showStarExplosion = false;
      this.showConfetti = false;
    }, 1500);
  }

  playErrorAnimation(): void {
    this.showErrorShake = true;
    setTimeout(() => {
      this.showErrorShake = false;
    }, 500);
  }

  playSound(type: 'correct' | 'wrong' | 'click'): void {
    try {
      let sound: HTMLAudioElement | null = null;
      
      switch(type) {
        case 'correct':
          sound = this.correctSound;
          break;
        case 'wrong':
          sound = this.wrongSound;
          break;
        case 'click':
          sound = this.clickSound;
          break;
      }

      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(err => console.log('Audio play failed:', err));
      }
    } catch (error) {
      console.log('Sound error:', error);
    }
  }

  vibrateDevice(): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  }

  finishGame(): void {
    this.gameFinished = true;
    this.calculateStars();
  }

  calculateStars(): void {
    const percentage = (this.score / this.questions.length) * 100;
    if (percentage >= 90) {
      this.starsEarned = 3;
    } else if (percentage >= 70) {
      this.starsEarned = 2;
    } else if (percentage >= 50) {
      this.starsEarned = 1;
    } else {
      this.starsEarned = 0;
    }
  }

  playAgain(): void {
    this.selectedCategory = null;
    this.selectedGame = null;
    this.gameStarted = false;
    this.gameFinished = false;
    this.showGamesList = false;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.starsEarned = 0;
  }

  backToCategories(): void {
    this.selectedCategory = null;
    this.selectedGame = null;
    this.showGamesList = false;
    this.gameStarted = false;
    this.gameFinished = false;
  }

  backToGamesList(): void {
    this.selectedGame = null;
    this.gameStarted = false;
    this.gameFinished = false;
    this.showGamesList = true;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  get progressPercentage(): number {
    if (this.questions.length === 0) return 0;
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  getCategoryGradient(): string {
    const cat = this.categories.find(c => c.id === this.selectedCategory);
    return cat?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }
}
