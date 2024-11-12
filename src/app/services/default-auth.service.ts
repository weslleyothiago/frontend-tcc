// src/services/default-auth.service.ts
import { Injectable } from '@angular/core';
import { auth } from './firebase.service';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class DefaultAuthService {
  constructor() {}

  async registerUser(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(auth, email, password);
  }

  async loginUser(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async resetPassword(email: string): Promise<void> {
    return await sendPasswordResetEmail(auth, email);
  }

  async logoutUser(): Promise<void> {
    return await signOut(auth);
  }

  async getProfile(): Promise<User | null> {
    return auth.currentUser; // Returns the current user
  }
}
