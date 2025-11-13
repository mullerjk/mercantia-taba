"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import the main component dynamically
const MercantiaSuperAdmin = dynamic(() => import('../page'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando Mercantia...</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function CatchAllPage({ params }: { params: { slug: string[] } }) {
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    // Extract the page from the slug
    const slug = params.slug?.[0] || 'dashboard';
    setPage(slug);

    // Update the URL to reflect the current page without causing a reload
    const newUrl = slug === 'dashboard' ? '/' : `/${slug}`;
    if (window.location.pathname !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [params.slug]);

  return <MercantiaSuperAdmin initialPage={page} />;
}
