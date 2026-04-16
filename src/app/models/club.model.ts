export interface Club {
  id: number;
  name: string;
  description: string;
  category: string;
  schedule: string;
  maxMembers: number;
  image: string;
  createdAt?: string | Date;
  requiredLevel?: string;
  capacity?: number;
  currentMembers?: number;
  createdBy?: number;
  tutorId?: number;
  tutorName?: string;
}

export interface ClubRequest {
  id: number;
  club: Club;
  userId: number;
  userEmail: string;
  userLevel: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  requestedAt: string;
  rejectionReason?: string;
}

export interface JoinRequestDto {
  userId: number;
  userEmail: string;
  userLevel: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: number;
  username: string;
  message: string;
  timestamp: Date;
  type: 'group' | 'private' | 'ai';
  fromUserId?: number;
  fromUsername?: string;
  toUserId?: number;
  edited?: boolean;
  editedAt?: Date;
  deleted?: boolean;
  pinned?: boolean;
  reactions?: { [emoji: string]: number[] };
  forwardedFrom?: { username: string; message: string } | null;
  // AI fields
  explanation?: string;
  original?: string;
  hasError?: boolean;
  mode?: string;
}
