import { Component } from '@angular/core';

interface Question {
  id: number;
  text: string;
  options: string[];
  selected?: string;
}

@Component({
  selector: 'app-preevaluation',
  templateUrl: './preevaluation.component.html',
  styleUrl: './preevaluation.component.scss',
  standalone: false,
})
export class PreevaluationComponent {
  levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  currentStep = 1;
  totalSteps = 3;
  resultLevel: string | null = null;
  isCompleted = false;

  questions: Question[] = [
    {
      id: 1,
      text: 'How would you describe your current level of understanding?',
      options: ['I understand basic phrases', 'I can handle simple conversations', 'I can discuss familiar topics', 'I can handle complex discussions', 'I understand nuanced language', 'I am fluent'],
    },
    {
      id: 2,
      text: 'How often do you practice speaking?',
      options: ['Rarely', 'Once a month', 'Once a week', 'Several times a week', 'Daily', 'Multiple times daily'],
    },
    {
      id: 3,
      text: 'What is your main goal?',
      options: ['Basic survival', 'Travel communication', 'Work communication', 'Academic study', 'Professional fluency', 'Native-like mastery'],
    },
  ];

  selectOption(question: Question, option: string): void {
    question.selected = option;
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitEvaluation(): void {
    const answered = this.questions.filter(q => q.selected).length;
    if (answered === this.questions.length) {
      this.resultLevel = 'B1';
      this.isCompleted = true;
    }
  }

  get currentQuestions(): Question[] {
    const perStep = Math.ceil(this.questions.length / this.totalSteps);
    const start = (this.currentStep - 1) * 1;
    return [this.questions[this.currentStep - 1]];
  }

  get canProceed(): boolean {
    return !!this.questions[this.currentStep - 1]?.selected;
  }
}
