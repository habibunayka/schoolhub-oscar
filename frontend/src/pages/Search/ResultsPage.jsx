import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  return <div className="p-4">Search results for "{query}"</div>;
}
