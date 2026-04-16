import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../services/chat.service';
import { ClubService } from '../../../services/club.service';
import { AdminManagementService } from '../../../services/admin-management.service';
import { ChatMessage, Club } from '../../../models/club.model';

interface Contact {
  userId: number;
  username: string;
  isTutor?: boolean;
  isGroup?: boolean;
  clubId?: number;
}

interface MemberRow {
  userId: number;
  username: string;
  userEmail: string;
  online: boolean;
  blocked: boolean;
}

@Component({
  selector: 'app-club-chat',
  templateUrl: './club-chat.component.html',
  styleUrl: './club-chat.component.scss',
  standalone: false,
})
export class ClubChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesEnd') messagesEnd!: ElementRef;
  @ViewChild('editInput') editInput!: ElementRef;

  club!: Club;
  clubId!: number;
  roomId!: string;

  contacts: Contact[] = [];
  activeContact: Contact | null = null;

  messages: ChatMessage[] = [];
  privateMessages: { [roomId: string]: ChatMessage[] } = {};
  pinnedMessages: ChatMessage[] = [];
  showPinned = false;

  newMessage = '';
  editingMessage: ChatMessage | null = null;
  editText = '';
  forwardingMessage: ChatMessage | null = null;

  // AI mode
  aiMode: 'off' | 'correction' | 'teacher' | 'suggestion' = 'correction';
  aiEnabled = true;

  contextMenu: { visible: boolean; x: number; y: number; msg: ChatMessage | null } =
    { visible: false, x: 0, y: 0, msg: null };

  reactionPicker: { visible: boolean; msg: ChatMessage | null } = { visible: false, msg: null };
  readonly EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '👏', '🎉'];

  onlineUsers: any[] = [];
  typingUsers: string[] = [];
  allMembers: MemberRow[] = [];

  accessDenied = false;
  loading = true;
  currentUser: any;
  isTutor = false;
  blockedUserIds: number[] = [];
  showModerationPanel = false;

  private subs: Subscription[] = [];
  private typingTimeout: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private clubService: ClubService,
    private userService: AdminManagementService
  ) {}

  ngOnInit(): void {
    this.clubId = Number(this.route.snapshot.paramMap.get('id'));
    this.roomId = 'club_' + this.clubId;
    this.userService.getMe().subscribe({
      next: (user) => {
        this.currentUser = { id: user.id, email: user.email, username: user.firstName + ' ' + user.lastName };
        this.clubService.checkAccess(this.clubId, user.id).subscribe({
          next: ({ access }) => {
            if (!access) { this.accessDenied = true; this.loading = false; return; }
            this.loadClubAndConnect();
          },
          error: () => { this.accessDenied = true; this.loading = false; }
        });
      },
      error: () => this.router.navigate(['/auth/login'])
    });
  }

  private loadClubAndConnect(): void {
    this.clubService.getById(this.clubId).subscribe(club => {
      this.club = club;
      this.isTutor = club.tutorId === this.currentUser.id;
      this.loading = false;
      this.connectChat();
      this.chatService.getBlockedUsers(this.clubId).subscribe(ids => {
        this.blockedUserIds = ids;
        this.refreshMemberRows();
      });
      if (this.isTutor) this.loadAllMembers();
    });
  }

  private loadAllMembers(): void {
    this.clubService.getMembers(this.clubId).subscribe(members => {
      this.allMembers = members
        .filter((m: any) => m.userId !== this.currentUser.id)
        .map((m: any) => ({
          userId: m.userId,
          username: m.userEmail,
          userEmail: m.userEmail,
          online: false,
          blocked: this.blockedUserIds.includes(m.userId)
        }));
    });
  }

  private refreshMemberRows(): void {
    const onlineIds = new Set(this.onlineUsers.map(u => u.userId));
    this.allMembers = this.allMembers.map(m => ({
      ...m,
      online: onlineIds.has(m.userId),
      blocked: this.blockedUserIds.includes(m.userId)
    }));
  }

  private connectChat(): void {
    this.chatService.connect();
    this.chatService.joinRoom(this.clubId, this.currentUser.id, this.currentUser.username);
    this.activeContact = { userId: 0, username: this.club?.name || 'Group', isGroup: true, clubId: this.clubId };

    this.subs.push(
      this.chatService.onMessageHistory().subscribe(msgs => {
        this.messages = msgs;
        this.pinnedMessages = msgs.filter(m => m.pinned && !m.deleted);
        setTimeout(() => this.scrollToBottom(), 50);
      }),
      this.chatService.onReceiveMessage().subscribe(msg => {
        if (msg.type === 'group') {
          this.messages.push(msg);
        } else {
          const rId = this.privateRoomId(msg.fromUserId!, msg.toUserId!);
          if (!this.privateMessages[rId]) this.privateMessages[rId] = [];
          this.privateMessages[rId].push(msg);
        }
        setTimeout(() => this.scrollToBottom(), 50);
      }),
      this.chatService.onAiMessage().subscribe(msg => {
        this.messages.push(msg);
        setTimeout(() => this.scrollToBottom(), 50);
      }),
      this.chatService.onMessageUpdated().subscribe(updated => {
        const idx = this.messages.findIndex(m => m.id === updated.id);
        if (idx !== -1) this.messages[idx] = { ...updated };
        this.pinnedMessages = this.messages.filter(m => m.pinned && !m.deleted);
      }),
      this.chatService.onPinnedMessages().subscribe(pinned => this.pinnedMessages = pinned),
      this.chatService.onOnlineUsers().subscribe(users => {
        this.onlineUsers = users;
        this.buildContacts(users);
        this.refreshMemberRows();
      }),
      this.chatService.onTyping().subscribe(({ username, isTyping }) => {
        if (isTyping) { if (!this.typingUsers.includes(username)) this.typingUsers.push(username); }
        else this.typingUsers = this.typingUsers.filter(u => u !== username);
      }),
      this.chatService.onKicked().subscribe(e => { alert(e.message); this.router.navigate(['/clubs']); }),
      this.chatService.onBlocked().subscribe(e => { alert(e.message); this.router.navigate(['/clubs']); }),
      this.chatService.onMemberKicked().subscribe(({ targetUserId }) => {
        this.onlineUsers = this.onlineUsers.filter(u => u.userId !== targetUserId);
        this.refreshMemberRows();
      }),
      this.chatService.onMemberBlocked().subscribe(({ targetUserId }) => {
        if (!this.blockedUserIds.includes(targetUserId)) this.blockedUserIds.push(targetUserId);
        this.onlineUsers = this.onlineUsers.filter(u => u.userId !== targetUserId);
        this.refreshMemberRows();
      }),
      this.chatService.onError().subscribe(err => { alert(err.message); this.router.navigate(['/clubs']); })
    );
  }

  private buildContacts(users: any[]): void {
    const group: Contact = { userId: 0, username: this.club?.name || 'Group Chat', isGroup: true, clubId: this.clubId };
    const members: Contact[] = users
      .filter(u => u.userId !== this.currentUser.id)
      .map(u => ({ userId: u.userId, username: u.username, isTutor: u.isTutor }));
    this.contacts = [group, ...members];
  }

  selectContact(c: Contact): void {
    this.activeContact = c;
    this.contextMenu.visible = false;
    if (!c.isGroup) {
      const rId = this.privateRoomId(this.currentUser.id, c.userId);
      this.chatService.joinPrivateRoom(this.currentUser.id, c.userId);
      if (!this.privateMessages[rId]) this.privateMessages[rId] = [];
      this.chatService.getHistory(rId).subscribe(msgs => {
        this.privateMessages[rId] = msgs;
        setTimeout(() => this.scrollToBottom(), 50);
      });
    }
    setTimeout(() => this.scrollToBottom(), 100);
  }

  get activeMessages(): ChatMessage[] {
    if (!this.activeContact || this.activeContact.isGroup) return this.messages;
    return this.privateMessages[this.privateRoomId(this.currentUser.id, this.activeContact.userId)] || [];
  }

  get activeRoomId(): string {
    if (!this.activeContact || this.activeContact.isGroup) return this.roomId;
    return this.privateRoomId(this.currentUser.id, this.activeContact.userId);
  }

  privateRoomId(a: number, b: number): string {
    return 'private_' + Math.min(a, b) + '_' + Math.max(a, b);
  }

  send(): void {
    const text = this.newMessage.trim();
    if (!text || this.forwardingMessage) return;
    if (this.activeContact?.isGroup) {
      const mode = this.aiEnabled ? this.aiMode : 'off';
      this.chatService.sendMessage(this.clubId, this.currentUser.id, this.currentUser.username, text, undefined, mode);
    } else if (this.activeContact) {
      this.chatService.sendPrivateMessage(this.currentUser.id, this.currentUser.username, this.activeContact.userId, text);
    }
    this.newMessage = '';
    this.chatService.sendTyping(this.clubId, this.currentUser.id, this.currentUser.username, false, this.activeRoomId);
  }

  sendForward(): void {
    if (!this.forwardingMessage) return;
    this.chatService.forwardMessage(
      this.forwardingMessage.roomId, this.activeRoomId,
      this.forwardingMessage.id, this.currentUser.id, this.currentUser.username, this.clubId
    );
    this.forwardingMessage = null;
    this.newMessage = '';
  }

  cancelForward(): void { this.forwardingMessage = null; this.newMessage = ''; }

  onTypingInput(): void {
    this.chatService.sendTyping(this.clubId, this.currentUser.id, this.currentUser.username, true, this.activeRoomId);
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() =>
      this.chatService.sendTyping(this.clubId, this.currentUser.id, this.currentUser.username, false, this.activeRoomId), 2000);
  }

  openContextMenu(event: MouseEvent, msg: ChatMessage): void {
    if (msg.type === 'ai') return;
    event.preventDefault();
    event.stopPropagation();
    this.contextMenu = { visible: true, x: event.clientX, y: event.clientY, msg };
    this.reactionPicker.visible = false;
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.contextMenu.visible = false;
    this.reactionPicker.visible = false;
  }

  startEdit(msg: ChatMessage): void {
    this.editingMessage = msg;
    this.editText = msg.message;
    this.contextMenu.visible = false;
    setTimeout(() => this.editInput?.nativeElement?.focus(), 50);
  }

  confirmEdit(): void {
    if (!this.editingMessage || !this.editText.trim()) return;
    this.chatService.editMessage(this.activeRoomId, this.editingMessage.id, this.editText.trim(), this.currentUser.id);
    this.editingMessage = null;
    this.editText = '';
  }

  cancelEdit(): void { this.editingMessage = null; this.editText = ''; }

  deleteMsg(msg: ChatMessage): void {
    this.chatService.deleteMessage(this.activeRoomId, msg.id, this.currentUser.id, this.clubId);
    this.contextMenu.visible = false;
  }

  pinMsg(msg: ChatMessage): void {
    this.chatService.pinMessage(this.activeRoomId, msg.id, this.currentUser.id, this.clubId);
    this.contextMenu.visible = false;
  }

  startForward(msg: ChatMessage): void {
    this.forwardingMessage = msg;
    this.newMessage = '';
    this.contextMenu.visible = false;
  }

  openReactionPicker(event: MouseEvent, msg: ChatMessage): void {
    event.stopPropagation();
    this.reactionPicker = { visible: true, msg };
    this.contextMenu.visible = false;
  }

  react(emoji: string): void {
    if (!this.reactionPicker.msg) return;
    this.chatService.reactMessage(this.activeRoomId, this.reactionPicker.msg.id, this.currentUser.id, emoji);
    this.reactionPicker.visible = false;
  }

  reactTo(emoji: string, msg: ChatMessage): void {
    this.chatService.reactMessage(this.activeRoomId, msg.id, this.currentUser.id, emoji);
  }

  reactionEntries(msg: ChatMessage): { emoji: string; count: number; reacted: boolean }[] {
    if (!msg.reactions) return [];
    return Object.entries(msg.reactions)
      .filter(([, users]) => (users as number[]).length > 0)
      .map(([emoji, users]) => ({ emoji, count: (users as number[]).length, reacted: (users as number[]).includes(this.currentUser?.id) }));
  }

  kick(member: MemberRow): void {
    if (!member.online) { alert('Member is not currently online.'); return; }
    if (confirm('Remove ' + member.username + ' from the chat session?'))
      this.chatService.kickMember(this.clubId, member.userId, this.currentUser.id);
  }

  block(member: MemberRow): void {
    if (confirm('Block ' + member.username + ' from this club chat?')) {
      this.chatService.blockMember(this.clubId, member.userId, this.currentUser.id);
      member.blocked = true;
      if (!this.blockedUserIds.includes(member.userId)) this.blockedUserIds.push(member.userId);
    }
  }

  unblock(member: MemberRow): void {
    this.chatService.unblockMember(this.clubId, member.userId, this.currentUser.id);
    member.blocked = false;
    this.blockedUserIds = this.blockedUserIds.filter(id => id !== member.userId);
  }

  isBlocked(userId: number): boolean { return this.blockedUserIds.includes(userId); }
  isOwn(msg: ChatMessage): boolean { return msg.userId === this.currentUser?.id; }
  canDelete(msg: ChatMessage): boolean { return this.isOwn(msg) || this.isTutor; }
  isAi(msg: ChatMessage): boolean { return msg.type === 'ai'; }

  setAiMode(m: string): void { this.aiMode = m as any; }

  aiModeLabel(): string {
    const labels: Record<string, string> = { correction: 'Correction', teacher: 'Teacher', suggestion: 'Suggestion', off: 'Off' };
    return labels[this.aiMode] || 'Off';
  }

  private scrollToBottom(): void {
    this.messagesEnd?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.chatService.disconnect();
  }
}
