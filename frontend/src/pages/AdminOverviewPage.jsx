import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function AdminOverviewPage() {
  const token = useAuthStore((state) => state.token);
  const [database, setDatabase] = useState('Перевірка…');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/system/metrics', {
      headers: { Authorization: 'Bearer ' + token },
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) throw new Error('Недоступно');
      const metrics = await response.json();
      setDatabase(metrics.db_status === 'ready' ? 'Готова' : 'Недоступна');
    }).catch((error) => {
      if (error.name !== 'AbortError') setDatabase('Недоступна');
    });
    return () => controller.abort();
  }, [token]);

  return (
    <section className="space-y-4 text-white">
      <h1 className="text-2xl font-semibold">Стан платформи</h1>
      <p>База даних <strong aria-live="polite">{database}</strong></p>
    </section>
  );
}
