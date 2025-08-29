import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clubs from '@services/clubs.js';

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['search', query],
    queryFn: () => clubs.listClubs({ search: query }),
    enabled: query.length > 0,
  });

  if (!query) return <div className="p-4">Please enter a search query.</div>;
  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error fetching results</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Search results for "{query}"</h1>
      {data.length === 0 ? (
        <div>No results found</div>
      ) : (
        <ul className="space-y-2">
          {data.map((club) => (
            <li key={club.id} className="bg-white p-3 rounded shadow">
              <Link to={`/clubs/${club.id}`} className="text-blue-600 hover:underline">
                {club.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
