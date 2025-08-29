import React from 'react';
import { useSearchParams } from 'react-router-dom';

// TODO : Buat versi full dari ini yang langsung fetch dari api, kalau api nya belum ada bisa dibikin.
export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  return <div className="p-4">Search results for "{query}"</div>;
}
