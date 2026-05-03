import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { QuestionService, QuizService } from '../../quiz-feedback/services/quiz-feedback.services';
import { Question, Quiz } from '../../quiz-feedback/models/quiz-feedback.models';

@Component({
  selector: 'app-kids-question-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="kids-question-manager">
      <div class="header">
        <button class="btn-back" (click)="goBack()">
          ← Back to Games
        </button>
        <h2>{{gameTitle}}</h2>
      </div>

      <div class="content-grid">
        <!-- Quick Add Form -->
        <div class="add-card">
          <h3>✨ Quick Add Question</h3>
          
          <div class="emoji-picker">
            <label>1. Pick an Emoji</label>
            <div class="emoji-grid">
              <button type="button" 
                      class="emoji-btn" 
                      *ngFor="let emoji of getEmojisForCategory()"
                      (click)="selectEmoji(emoji)"
                      [class.selected]="currentQuestion.imageEmoji === emoji">
                {{emoji}}
              </button>
            </div>
            <input type="text" 
                   class="emoji-input" 
                   [(ngModel)]="currentQuestion.imageEmoji"
                   placeholder="Or type your own emoji"
                   maxlength="2">
          </div>

          <div class="form-group">
            <label>2. Correct Answer</label>
            <input type="text" 
                   class="form-control" 
                   [(ngModel)]="currentQuestion.correctAnswer"
                   placeholder="e.g., cat"
                   (input)="onCorrectAnswerChange()">
          </div>

          <div class="form-group">
            <label>3. Wrong Answers (auto-suggested)</label>
            <div class="wrong-answers-grid">
              <input type="text" 
                     class="form-control" 
                     [(ngModel)]="wrongAnswers[0]"
                     placeholder="Wrong answer 1">
              <input type="text" 
                     class="form-control" 
                     [(ngModel)]="wrongAnswers[1]"
                     placeholder="Wrong answer 2">
              <input type="text" 
                     class="form-control" 
                     [(ngModel)]="wrongAnswers[2]"
                     placeholder="Wrong answer 3">
            </div>
          </div>

          <button class="btn-add" 
                  (click)="saveQuestion()"
                  [disabled]="!isFormValid()">
            {{editingQuestion ? '✓ Update' : '+ Add'}} Question
          </button>

          <button class="btn-cancel" 
                  *ngIf="editingQuestion"
                  (click)="cancelEdit()">
            Cancel
          </button>
        </div>

        <!-- Questions List -->
        <div class="questions-list">
          <h3>Questions ({{questions.length}})</h3>
          
          <div class="empty-state" *ngIf="questions.length === 0">
            <div class="empty-icon">📝</div>
            <p>No questions yet</p>
            <small>Add your first question using the form</small>
          </div>

          <div class="question-item" *ngFor="let question of questions; let i = index">
            <div class="question-preview">
              <span class="emoji">{{question.imageEmoji}}</span>
              <div class="question-info">
                <strong>{{question.correctAnswer}}</strong>
                <small>{{question.options?.join(', ')}}</small>
              </div>
            </div>
            <div class="question-actions">
              <button class="btn-edit" (click)="editQuestion(question)">
                ✏️
              </button>
              <button class="btn-delete" (click)="deleteQuestion(question.id!)">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .kids-question-manager {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-bottom: 2rem;
      
      h2 {
        margin: 0;
        color: #333;
      }
    }

    .btn-back {
      background: #6366f1;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: #4f46e5;
        transform: translateX(-5px);
      }
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .add-card, .questions-list {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      
      h3 {
        margin: 0 0 1.5rem 0;
        color: #333;
        font-size: 1.5rem;
      }
    }

    .emoji-picker {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        font-weight: 600;
        color: #555;
        margin-bottom: 0.75rem;
      }
    }

    .emoji-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .emoji-btn {
      background: #f3f4f6;
      border: 3px solid transparent;
      padding: 1rem;
      border-radius: 10px;
      font-size: 2rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: #e5e7eb;
        transform: scale(1.1);
      }
      
      &.selected {
        background: #dbeafe;
        border-color: #3b82f6;
        transform: scale(1.1);
      }
    }

    .emoji-input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 2rem;
      text-align: center;
      
      &:focus {
        outline: none;
        border-color: #3b82f6;
      }
    }

    .form-group {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        font-weight: 600;
        color: #555;
        margin-bottom: 0.75rem;
      }
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 1rem;
      transition: border-color 0.2s;
      
      &:focus {
        outline: none;
        border-color: #3b82f6;
      }
    }

    .wrong-answers-grid {
      display: grid;
      gap: 0.75rem;
    }

    .btn-add, .btn-cancel {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 0.5rem;
    }

    .btn-add {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-cancel {
      background: #e5e7eb;
      color: #333;
      
      &:hover {
        background: #d1d5db;
      }
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #9ca3af;
      
      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      
      p {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      
      small {
        font-size: 0.9rem;
      }
    }

    .question-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 10px;
      margin-bottom: 0.75rem;
      transition: all 0.2s;
      
      &:hover {
        background: #f3f4f6;
        transform: translateX(5px);
      }
    }

    .question-preview {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
      
      .emoji {
        font-size: 2.5rem;
      }
      
      .question-info {
        strong {
          display: block;
          color: #333;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }
        
        small {
          color: #6b7280;
        }
      }
    }

    .question-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-edit, .btn-delete {
      background: white;
      border: 2px solid #e5e7eb;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      font-size: 1.25rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        transform: scale(1.1);
      }
    }

    .btn-edit:hover {
      border-color: #3b82f6;
      background: #dbeafe;
    }

    .btn-delete:hover {
      border-color: #ef4444;
      background: #fee2e2;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class KidsQuestionManagerComponent implements OnInit {
  quizId!: number;
  gameTitle: string = '';
  gameCategory: string = '';
  questions: Question[] = [];
  
  currentQuestion: Partial<Question> = {
    questionText: '',
    correctAnswer: '',
    imageEmoji: '',
    type: 'MULTIPLE_CHOICE',
    points: 1
  };
  
  wrongAnswers: string[] = ['', '', ''];
  editingQuestion: Question | null = null;

  // Emoji suggestions by category
  emojiSuggestions: any = {
    animals: ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🐢', '🐍', '🦎', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈'],
    colors: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '🌈', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍'],
    numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '0️⃣']
  };

  // Common wrong answers by category
  commonAnswers: any = {
    animals: ['cat', 'dog', 'bird', 'fish', 'rabbit', 'lion', 'tiger', 'bear', 'elephant', 'monkey', 'horse', 'cow', 'pig', 'sheep', 'chicken', 'duck', 'frog', 'snake', 'turtle', 'mouse'],
    colors: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'gray'],
    numbers: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'zero']
  };

  constructor(
    private questionService: QuestionService,
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGameInfo();
    this.loadQuestions();
  }

  loadGameInfo(): void {
    this.quizService.getById(this.quizId).subscribe({
      next: (quiz: Quiz) => {
        this.gameTitle = quiz.title;
        this.gameCategory = quiz.category || '';
      },
      error: (error: any) => console.error('Error loading game:', error)
    });
  }

  loadQuestions(): void {
    this.questionService.getByQuiz(this.quizId).subscribe({
      next: (questions: Question[]) => {
        this.questions = questions;
      },
      error: (error: any) => console.error('Error loading questions:', error)
    });
  }

  getEmojisForCategory(): string[] {
    return this.emojiSuggestions[this.gameCategory] || this.emojiSuggestions.animals;
  }

  selectEmoji(emoji: string): void {
    this.currentQuestion.imageEmoji = emoji;
  }

  onCorrectAnswerChange(): void {
    // Auto-suggest wrong answers
    const correct = this.currentQuestion.correctAnswer?.toLowerCase() || '';
    if (correct && this.gameCategory) {
      const suggestions = this.commonAnswers[this.gameCategory] || [];
      const filtered = suggestions.filter((ans: string) => ans !== correct);
      
      for (let i = 0; i < 3 && i < filtered.length; i++) {
        if (!this.wrongAnswers[i]) {
          this.wrongAnswers[i] = filtered[i];
        }
      }
    }
  }

  isFormValid(): boolean {
    return !!(
      this.currentQuestion.imageEmoji &&
      this.currentQuestion.correctAnswer &&
      this.wrongAnswers[0] &&
      this.wrongAnswers[1] &&
      this.wrongAnswers[2]
    );
  }

  saveQuestion(): void {
    const options = [
      this.currentQuestion.correctAnswer!,
      ...this.wrongAnswers.filter(a => a.trim() !== '')
    ];

    const questionData: Partial<Question> = {
      ...this.currentQuestion,
      questionText: `What is this? ${this.currentQuestion.imageEmoji}`,
      options: options,
      quizId: this.quizId
    };

    if (this.editingQuestion) {
      this.questionService.update(this.editingQuestion.id!, questionData).subscribe({
        next: () => {
          this.loadQuestions();
          this.resetForm();
        },
        error: (error: any) => {
          console.error('Error updating question:', error);
          alert('Failed to update question');
        }
      });
    } else {
      this.questionService.create(questionData as Question).subscribe({
        next: () => {
          this.loadQuestions();
          this.resetForm();
        },
        error: (error: any) => {
          console.error('Error adding question:', error);
          alert('Failed to add question');
        }
      });
    }
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.currentQuestion = {
      imageEmoji: question.imageEmoji,
      correctAnswer: question.correctAnswer,
      questionText: question.questionText,
      type: question.type,
      points: question.points
    };
    
    this.wrongAnswers = question.options?.filter(opt => opt !== question.correctAnswer) || ['', '', ''];
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteQuestion(id: number): void {
    if (confirm('Delete this question?')) {
      this.questionService.delete(id).subscribe({
        next: () => this.loadQuestions(),
        error: (error: any) => {
          console.error('Error deleting question:', error);
          alert('Failed to delete question');
        }
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentQuestion = {
      questionText: '',
      correctAnswer: '',
      imageEmoji: '',
      type: 'MULTIPLE_CHOICE',
      points: 1
    };
    this.wrongAnswers = ['', '', ''];
    this.editingQuestion = null;
  }

  goBack(): void {
    this.router.navigate(['/dashboard/kids-games']);
  }
}
