'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <main className="flex h-screen items-center justify-center bg-gray-900">
      <p className="text-white">Redirecting...</p>
    </main>
  );
}