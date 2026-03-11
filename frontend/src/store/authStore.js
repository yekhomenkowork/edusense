import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      rememberMe: false,

      login: async (email, password, rememberMe) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Невірний логін або пароль');
          }

          const data = await response.json();
          
          set({ 
            user: data.user, 
            token: data.access_token,
            isAuthenticated: true,
            rememberMe: rememberMe
          });
          
          return true;
        } catch (error) {
          console.error("Помилка авторизації:", error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, token: null, rememberMe: false });
        localStorage.removeItem('auth-storage');
        sessionStorage.removeItem('auth-storage');
      },
    }),
    { 
      name: 'auth-storage',
      // Використовуємо localStorage за замовчуванням для persist
      storage: createJSONStorage(() => localStorage) 
    }
  )
);
