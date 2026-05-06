import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/club.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket;
  private readonly CHAT_URL = 'http://localhost:3001';

  constructor(private http: HttpClient) {
    this.socket = io(this.CHAT_URL, { autoConnect: false });
  }

  connect(): void { if (!this.socket.connected) this.socket.connect(); }
  disconnect(): void { this.socket.disconnect(); }

  joinRoom(clubId: number, userId: number, username: string): void {
    this.socket.emit('joinRoom', { clubId, userId, username });
  }

  sendMessage(clubId: number, userId: number, username: string, message: string, forwardedFrom?: any, aiMode?: string): void {
    this.socket.emit('sendMessage', { clubId, userId, username, message, forwardedFrom, aiMode });
  }

  onReceiveMessage(): Observable<ChatMessage> {
    return new Observable(obs => { this.socket.on('receiveMessage', (msg: ChatMessage) => obs.next(msg)); });
  }

  onMessageHistory(): Observable<ChatMessage[]> {
    return new Observable(obs => { this.socket.on('messageHistory', (msgs: ChatMessage[]) => obs.next(msgs)); });
  }

  onMessageUpdated(): Observable<ChatMessage> {
    return new Observable(obs => { this.socket.on('messageUpdated', (msg: ChatMessage) => obs.next(msg)); });
  }

  onPinnedMessages(): Observable<ChatMessage[]> {
    return new Observable(obs => { this.socket.on('pinnedMessages', (msgs: ChatMessage[]) => obs.next(msgs)); });
  }

  onAiMessage(): Observable<any> {
    return new Observable(obs => { this.socket.on('aiMessage', (msg: any) => obs.next(msg)); });
  }

  onUserJoined(): Observable<any> {
    return new Observable(obs => { this.socket.on('userJoined', (d: any) => obs.next(d)); });
  }

  onUserLeft(): Observable<any> {
    return new Observable(obs => { this.socket.on('userLeft', (d: any) => obs.next(d)); });
  }

  onOnlineUsers(): Observable<any[]> {
    return new Observable(obs => { this.socket.on('onlineUsers', (u: any[]) => obs.next(u)); });
  }

  editMessage(roomId: string, messageId: string, newText: string, userId: number): void {
    this.socket.emit('editMessage', { roomId, messageId, newText, userId });
  }

  deleteMessage(roomId: string, messageId: string, userId: number, clubId?: number): void {
    this.socket.emit('deleteMessage', { roomId, messageId, userId, clubId });
  }

  pinMessage(roomId: string, messageId: string, userId: number, clubId?: number): void {
    this.socket.emit('pinMessage', { roomId, messageId, userId, clubId });
  }

  reactMessage(roomId: string, messageId: string, userId: number, emoji: string): void {
    this.socket.emit('reactMessage', { roomId, messageId, userId, emoji });
  }

  forwardMessage(fromRoomId: string, toRoomId: string, messageId: string, userId: number, username: string, clubId?: number): void {
    this.socket.emit('forwardMessage', { fromRoomId, toRoomId, messageId, userId, username, clubId });
  }

  sendTyping(clubId: number, userId: number, username: string, isTyping: boolean, roomId?: string): void {
    this.socket.emit('typing', { clubId, userId, username, isTyping, roomId });
  }

  onTyping(): Observable<any> {
    return new Observable(obs => { this.socket.on('typing', (d: any) => obs.next(d)); });
  }

  joinPrivateRoom(userId: number, targetUserId: number): void {
    this.socket.emit('joinPrivateRoom', { userId, targetUserId });
  }

  sendPrivateMessage(fromUserId: number, fromUsername: string, toUserId: number, message: string): void {
    this.socket.emit('privateMessage', { fromUserId, fromUsername, toUserId, message });
  }

  kickMember(clubId: number, targetUserId: number, tutorUserId: number): void {
    this.socket.emit('kickMember', { clubId, targetUserId, tutorUserId });
  }

  blockMember(clubId: number, targetUserId: number, tutorUserId: number): void {
    this.socket.emit('blockMember', { clubId, targetUserId, tutorUserId });
  }

  unblockMember(clubId: number, targetUserId: number, tutorUserId: number): void {
    this.socket.emit('unblockMember', { clubId, targetUserId, tutorUserId });
  }

  onMemberKicked(): Observable<any> {
    return new Observable(obs => { this.socket.on('memberKicked', (d: any) => obs.next(d)); });
  }

  onMemberBlocked(): Observable<any> {
    return new Observable(obs => { this.socket.on('memberBlocked', (d: any) => obs.next(d)); });
  }

  onKicked(): Observable<any> {
    return new Observable(obs => { this.socket.on('kicked', (d: any) => obs.next(d)); });
  }

  onBlocked(): Observable<any> {
    return new Observable(obs => { this.socket.on('blocked', (d: any) => obs.next(d)); });
  }

  getHistory(roomId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(this.CHAT_URL + '/api/chat/' + roomId + '/messages');
  }

  getPinned(roomId: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(this.CHAT_URL + '/api/chat/' + roomId + '/pinned');
  }

  getBlockedUsers(clubId: number): Observable<number[]> {
    return this.http.get<number[]>(this.CHAT_URL + '/api/chat/club/' + clubId + '/blocked');
  }

  onError(): Observable<any> {
    return new Observable(obs => { this.socket.on('error', (err: any) => obs.next(err)); });
  }
}
