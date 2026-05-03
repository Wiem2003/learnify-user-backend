export interface GameCategory {
  id?: number;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface KidsGame {
  id?: number;
  title: string;
  description?: string;
  categoryId: number;
  categoryName?: string;
  categoryIcon?: string;
  categoryColor?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  questionCount?: number;
}

export interface GameQuestion {
  id?: number;
  gameId: number;
  imageEmoji: string;
  correctAnswer: string;
  options: string[];
  points?: number;
}
