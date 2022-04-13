import create from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchJson } from '../utils/client';

const useUser = create(
  persist(
    (set) => {
      function template<T>(base: string) {
        return async function (payload: T, { asVendor } = { asVendor: false }) {
          const res = await fetchJson(`${base}${asVendor ? '?vendor' : ''}`, payload, {
            method: 'POST',
          });
          const msg = await res.text();
          if (res.status < 400 && msg) {
            set({ userId: msg, isVendor: asVendor });
            return null;
          }
          return msg;
        };
      }
      return {
        userId: '',
        username: '',
        email: '',
        isVendor: false,
        login: template<{ identity: string; password: string }>('/api/login'),
        signup: template<{ username: string; password: string; email?: string }>('/api/signup'),
      };
    },
    { name: 'user' }
  )
);

export default useUser;
