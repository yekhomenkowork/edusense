import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      login: async (email, password) => {
        try {
          console.log("🚀 Відправляємо запит на бекенд...");
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("❌ Сервер повернув помилку:", errorData);
            throw new Error(errorData.detail || 'Невірний логін або пароль');
          }

          const data = await response.json();
          console.log("✅ Успішна авторизація, дані:", data);
          
          set({ 
            user: data.user, 
            token: data.access_token,
            isAuthenticated: true 
          });
          
          return true;
        } catch (error) {
          console.error("❌ Критична помилка fetch:", error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, token: null });
        localStorage.removeItem('auth-storage');
      },
    }),
    { name: 'auth-storage' }
  )
);
