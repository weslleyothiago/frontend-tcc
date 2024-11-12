import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase.service'; // Adjust the path as needed

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  // Observable that keeps the state of the logged-in user
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {}

  // Method to check if the email is already registered
  private async checkIfEmailIsRegistered(email: string): Promise<boolean> {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0; // Returns true if there are sign-in methods for the email
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  // Method to log in with Google
  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user's email is registered
      const isRegistered = await this.checkIfEmailIsRegistered(user.email!);
      if (isRegistered) {
        this.userSubject.next(user); // Update the state with the authenticated user
      } else {
        // If the email is not registered, log out and throw an error
        await this.logout();
        throw new Error('User is not registered.'); // Message that can be displayed to the user
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error; // Returns the error to be handled in the component
    }
  }

  // Method to register a new user with Google
  async registerUserWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create a new user in Firebase with the generated email and password
      const email = user.email!;
      const password = 'randomGeneratedPassword'; // Here you can generate a random password or use a default one
      await createUserWithEmailAndPassword(auth, email, password);

      this.userSubject.next(user); // Update the state with the authenticated user
    } catch (error) {
      console.error('Error registering user with Google:', error);
      throw error;
    }
  }

  // Method to log out
  logout(): Promise<void> {
    return signOut(auth)
      .then(() => {
        this.userSubject.next(null); // Clear the state on logout
      })
      .catch((error) => {
        console.error('Error logging out:', error);
        throw error;
      });
  }
}
