import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { loginPayload } from './loginPayload';

// Читаємо базовий URL зі змінних середовища (з .env фронтенду) 
// Якщо його немає, використовуємо '/api' (це працюватиме ідеально завдяки Nginx)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      rememberMe: false,

      login: async (email, password, otp) => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginPayload(email, password, otp)),
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
            rememberMe: false
          });
          
          return true;
        } catch (error) {
          console.error("Помилка авторизації:", error);
          throw error;
        }
      },

      logout: () => {
        const token = get().token;
        if (token) {
          void fetch(API_BASE_URL + '/auth/logout', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token },
          }).catch(console.error);
        }
        set({ user: null, isAuthenticated: false, token: null, rememberMe: false });
        localStorage.removeItem('auth-storage');
        sessionStorage.removeItem('auth-storage');
      },
    }),
    { 
      name: 'edusense-session',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
