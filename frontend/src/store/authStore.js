import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // Зберігатиме { id, name, email, role, schoolId }
  isAuthenticated: false,
  
  // Функція входу (Mock Auth)
  login: (userData) => set({ 
    user: userData, 
    isAuthenticated: true 
  }),
  
  // Функція виходу
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
}));
