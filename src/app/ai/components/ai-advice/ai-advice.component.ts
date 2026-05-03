import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { QuizAttemptResponse, Quiz } from '../../../quiz-feedback/models/quiz-feedback.models';
import { QuizAttemptService, QuizService } from '../../../quiz-feedback/services/quiz-feedback.services';
import { AiService } from '../../services/ai.service';
import { PersonalizedFeedback } from '../../models/ai.models';

@Component({
  selector: 'app-ai-advice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-advice.component.html',
  styleUrls: ['./ai-advice.component.scss']
})
export class AiAdviceComponent implements OnInit, OnDestroy {
  attempt?: QuizAttemptResponse;
  quiz?: Quiz;
  advice: PersonalizedFeedback | null = null;
  loading = false;
  error = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attemptService: QuizAttemptService,
    private quizService: QuizService,
    private aiService: AiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const attemptId = params['attemptId'];
      const quizId = params['quizId'];
      
      if (attemptId && quizId) {
        this.loadData(+attemptId, +quizId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(attemptId: number, quizId: number): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      attempt: this.attemptService.getById(attemptId),
      quiz: this.quizService.getById(quizId)
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.attempt = data.attempt;
        this.quiz = data.quiz;
        this.generateAdvice();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.error = 'Impossible de charger les données';
        this.loading = false;
      }
    });
  }

  generateAdvice(): void {
    if (!this.attempt || !this.quiz) return;

    const request = {
      attemptId: this.attempt.id,
      quizTitle: this.quiz.title,
      score: this.attempt.score,
      totalPoints: this.attempt.totalPoints,
      questionResults: []
    };

    this.aiService.analyzeFeedback(request).pipe(takeUntil(this.destroy$)).subscribe({
      next: (feedback) => {
        this.advice = feedback;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la génération des conseils:', error);
        // Générer des conseils par défaut basés sur le score
        this.generateDefaultAdvice();
        this.loading = false;
      }
    });
  }

  generateDefaultAdvice(): void {
    if (!this.attempt || !this.quiz) return;

    const percentage = (this.attempt.score / this.attempt.totalPoints) * 100;
    
    let strengths: string[] = [];
    let weaknesses: string[] = [];
    let recommendations: string[] = [];
    let overallFeedback = '';

    if (percentage >= 80) {
      overallFeedback = 'Excellent travail! Vous avez une très bonne maîtrise du sujet.';
      strengths = [
        'Excellente compréhension globale du sujet',
        'Capacité à répondre correctement aux questions complexes',
        'Bonne gestion du temps'
      ];
      recommendations = [
        'Continuez à pratiquer régulièrement pour maintenir votre niveau',
        'Explorez des sujets plus avancés pour approfondir vos connaissances',
        'Partagez vos connaissances avec d\'autres étudiants'
      ];
    } else if (percentage >= 60) {
      overallFeedback = 'Bon travail! Vous avez une compréhension solide, mais il y a encore de la marge pour progresser.';
      strengths = [
        'Bonne compréhension des concepts de base',
        'Capacité à identifier les bonnes réponses dans la plupart des cas'
      ];
      weaknesses = [
        'Quelques lacunes sur certains concepts spécifiques',
        'Besoin de plus de pratique sur les questions complexes'
      ];
      recommendations = [
        'Revoyez les questions où vous avez fait des erreurs',
        'Pratiquez davantage les concepts qui vous posent problème',
        'Utilisez des ressources supplémentaires pour renforcer vos connaissances',
        'Refaites le quiz après avoir révisé'
      ];
    } else if (percentage >= 40) {
      overallFeedback = 'Vous avez des bases, mais il est important de travailler davantage pour améliorer votre compréhension.';
      weaknesses = [
        'Compréhension partielle des concepts clés',
        'Difficultés avec plusieurs types de questions',
        'Besoin de renforcer les fondamentaux'
      ];
      recommendations = [
        'Revoyez attentivement le cours avant de refaire le quiz',
        'Concentrez-vous sur les concepts de base',
        'Pratiquez avec des exercices supplémentaires',
        'N\'hésitez pas à demander de l\'aide à votre tuteur',
        'Prenez le temps de bien comprendre chaque concept avant de passer au suivant'
      ];
    } else {
      overallFeedback = 'Il semble que vous ayez besoin de revoir le cours en profondeur. Ne vous découragez pas!';
      weaknesses = [
        'Compréhension limitée des concepts fondamentaux',
        'Difficultés importantes avec la plupart des questions',
        'Besoin d\'un apprentissage plus approfondi'
      ];
      recommendations = [
        'Reprenez le cours depuis le début',
        'Prenez des notes détaillées pendant votre révision',
        'Demandez de l\'aide à votre tuteur pour clarifier les concepts',
        'Pratiquez avec des exercices simples avant de refaire le quiz',
        'Accordez-vous plus de temps pour assimiler les concepts',
        'Rejoignez un groupe d\'étude pour apprendre avec d\'autres'
      ];
    }

    this.advice = {
      overallFeedback,
      strengths,
      weaknesses,
      recommendations,
      motivationalMessage: this.getEncouragement(percentage)
    };
  }

  getEncouragement(percentage: number): string {
    if (percentage >= 80) {
      return 'Vous êtes sur la bonne voie! Continuez comme ça et vous atteindrez l\'excellence.';
    } else if (percentage >= 60) {
      return 'Vous avez le potentiel pour réussir. Avec un peu plus d\'efforts, vous y arriverez!';
    } else if (percentage >= 40) {
      return 'Ne baissez pas les bras! Chaque effort compte et vous progresserez avec de la pratique.';
    } else {
      return 'L\'apprentissage est un voyage. Prenez votre temps, soyez patient avec vous-même, et vous verrez des progrès!';
    }
  }

  getPercentage(): number {
    if (!this.attempt) return 0;
    return (this.attempt.score / this.attempt.totalPoints) * 100;
  }

  getScoreClass(): string {
    const percentage = this.getPercentage();
    if (percentage >= 80) return 'score-excellent';
    if (percentage >= 60) return 'score-good';
    if (percentage >= 40) return 'score-average';
    return 'score-poor';
  }

  goBack(): void {
    if (this.attempt?.id) {
      this.router.navigate(['/attempts', this.attempt.id, 'result']);
    } else {
      this.router.navigate(['/quizzes']);
    }
  }

  retakeQuiz(): void {
    if (this.quiz?.id) {
      if (confirm('Voulez-vous refaire ce quiz? Vos résultats actuels seront conservés.')) {
        this.router.navigate(['/quizzes', this.quiz.id, 'take']);
      }
    }
  }

  viewQuizzes(): void {
    this.router.navigate(['/quizzes']);
  }
}
