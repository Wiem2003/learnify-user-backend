import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Quiz, Question } from '../../../models/quiz-feedback.models';
import { QuizService, QuestionService } from '../../../services/quiz-feedback.services';

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-question-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './question-manager.component.html',
  styleUrls: ['./question-manager.component.scss']
})
export class QuestionManagerComponent implements OnInit, OnDestroy {
  quiz?: Quiz;
  questions: Question[] = [];
  loading = false;
  
  // Question Editor
  showEditor = false;
  editingQuestion?: Question;
  editorMode: 'create' | 'edit' = 'create';
  
  currentQuestion: {
    questionText: string;
    type: string;
    points: number;
    options: QuestionOption[];
    explanation: string;
  } = {
    questionText: '',
    type: 'MULTIPLE_CHOICE',
    points: 10,
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    explanation: ''
  };
  
  // Preview
  showPreview = false;
  selectedPreviewAnswer: number | null = null;
  
  // Drag & Drop
  draggedIndex: number | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadQuiz(id);
        this.loadQuestions(id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadQuiz(id: number): void {
    this.quizService.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (quiz) => this.quiz = quiz,
      error: (error) => console.error('Error loading quiz:', error)
    });
  }

  loadQuestions(quizId: number): void {
    this.loading = true;
    this.questionService.getByQuiz(quizId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/quizzes']);
  }

  openEditor(question?: Question): void {
    this.showEditor = true;
    this.showPreview = false;
    
    if (question) {
      this.editorMode = 'edit';
      this.editingQuestion = question;
      
      // Parse options
      const options = question.options || [];
      const correctAnswer = question.correctAnswer || '';
      
      this.currentQuestion = {
        questionText: question.questionText || '',
        type: question.type || 'MULTIPLE_CHOICE',
        points: question.points || 10,
        options: options.map((opt: string) => ({
          text: opt,
          isCorrect: opt === correctAnswer
        })),
        explanation: question.explanation || ''
      };
    } else {
      this.editorMode = 'create';
      this.editingQuestion = undefined;
      this.resetEditor();
    }
  }

  closeEditor(): void {
    this.showEditor = false;
    this.showPreview = false;
    this.resetEditor();
  }

  resetEditor(): void {
    this.currentQuestion = {
      questionText: '',
      type: 'MULTIPLE_CHOICE',
      points: 10,
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      explanation: ''
    };
  }

  addOption(): void {
    this.currentQuestion.options.push({ text: '', isCorrect: false });
  }

  removeOption(index: number): void {
    if (this.currentQuestion.options.length > 2) {
      this.currentQuestion.options.splice(index, 1);
    }
  }

  setCorrectAnswer(index: number): void {
    this.currentQuestion.options.forEach((opt, i) => {
      opt.isCorrect = i === index;
    });
  }

  togglePreview(): void {
    this.showPreview = !this.showPreview;
    this.selectedPreviewAnswer = null;
  }

  saveQuestion(): void {
    // Validation
    if (!this.currentQuestion.questionText.trim()) {
      alert('Veuillez entrer une question');
      return;
    }

    const hasCorrectAnswer = this.currentQuestion.options.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      alert('Veuillez sélectionner la bonne réponse');
      return;
    }

    const hasEmptyOptions = this.currentQuestion.options.some(opt => !opt.text.trim());
    if (hasEmptyOptions) {
      alert('Toutes les options doivent avoir un texte');
      return;
    }

    // Prepare data
    const correctAnswer = this.currentQuestion.options.find(opt => opt.isCorrect)?.text || '';
    const questionData: Partial<Question> = {
      quizId: this.quiz?.id,
      questionText: this.currentQuestion.questionText,
      type: this.currentQuestion.type as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER',
      points: this.currentQuestion.points,
      options: this.currentQuestion.options.map(opt => opt.text),
      correctAnswer: correctAnswer,
      explanation: this.currentQuestion.explanation
    };

    if (this.editorMode === 'edit' && this.editingQuestion?.id) {
      this.questionService.update(this.editingQuestion.id, questionData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            if (this.quiz?.id) this.loadQuestions(this.quiz.id);
            this.closeEditor();
          },
          error: (error) => {
            console.error('Error updating question:', error);
            alert('Erreur lors de la mise à jour de la question');
          }
        });
    } else {
      this.questionService.create(questionData as Question)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            if (this.quiz?.id) this.loadQuestions(this.quiz.id);
            this.closeEditor();
          },
          error: (error) => {
            console.error('Error creating question:', error);
            alert('Erreur lors de la création de la question');
          }
        });
    }
  }

  deleteQuestion(question: Question): void {
    if (!question.id) return;
    
    if (confirm(`Supprimer la question "${question.questionText}" ?`)) {
      this.questionService.delete(question.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            if (this.quiz?.id) this.loadQuestions(this.quiz.id);
          },
          error: (error) => {
            console.error('Error deleting question:', error);
            alert('Erreur lors de la suppression de la question');
          }
        });
    }
  }

  duplicateQuestion(question: Question): void {
    const duplicate: Partial<Question> = {
      quizId: this.quiz?.id,
      questionText: question.questionText + ' (copie)',
      type: question.type,
      points: question.points,
      options: [...(question.options || [])],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    };

    this.questionService.create(duplicate as Question)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.quiz?.id) this.loadQuestions(this.quiz.id);
        },
        error: (error) => {
          console.error('Error duplicating question:', error);
          alert('Erreur lors de la duplication de la question');
        }
      });
  }

  // Drag & Drop
  onDragStart(index: number): void {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    
    if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
      const draggedQuestion = this.questions[this.draggedIndex];
      this.questions.splice(this.draggedIndex, 1);
      this.questions.splice(dropIndex, 0, draggedQuestion);
    }
    
    this.draggedIndex = null;
  }

  getTotalPoints(): number {
    return this.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  }

  getQuestionTypeIcon(type: string): string {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'bi-ui-radios';
      case 'TRUE_FALSE': return 'bi-check2-square';
      case 'SHORT_ANSWER': return 'bi-textarea-t';
      default: return 'bi-question-circle';
    }
  }

  getQuestionTypeLabel(type: string): string {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'Choix multiple';
      case 'TRUE_FALSE': return 'Vrai/Faux';
      case 'SHORT_ANSWER': return 'Réponse courte';
      default: return type;
    }
  }
}
