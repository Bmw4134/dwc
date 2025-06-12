
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/heartbeat')
      .then(res => res.json())
      .then(() => {
        setLoading(false);
        router.push('/login');
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-xl">Loading DWC Systems...</div>
      </div>
    );
  }

  return null;
}
