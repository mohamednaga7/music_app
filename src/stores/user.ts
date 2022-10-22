import { auth, usersCollection } from '@/includes/firebase';
import { defineStore } from 'pinia';

export interface RegisterFormValues {
  name: string;
  email: string;
  age: number;
  password: string;
  confirm_password: string;
  country: string;
  tos: boolean;
}

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values: RegisterFormValues) {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      usersCollection.doc(userCredentials?.user?.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });

      await userCredentials.user?.updateProfile({
        displayName: values.name,
      });

      this.userLoggedIn = true;
    },
    async login({ email, password }: { email: string; password: string }) {
      await auth.signInWithEmailAndPassword(email, password);
      this.userLoggedIn = true;
    },
    async signout() {
      await auth.signOut();

      this.userLoggedIn = false;
    },
  },
});
