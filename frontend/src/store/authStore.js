import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Читаємо базовий URL зі змінних середовища (з .env фронтенду) 
// Якщо його немає, використовуємо '/api' (це працюватиме ідеально завдяки Nginx)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      rememberMe: false,

      login: async (email, password, rememberMe) => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
      storage: createJSONStorage(() => localStorage) 
    }
  )
);
