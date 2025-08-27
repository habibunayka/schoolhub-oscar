import React from 'react';
import { useQuery } from '../lib/queryClient.js';
import { apiClient } from '../lib/apiClient.js';

export function ClubList({ onViewProfile }) {
  const { data = [], isLoading, error } = useQuery('clubs', () => apiClient('/clubs'));
  if (isLoading) return React.createElement('p', null, 'Loading clubs...');
  if (error) return React.createElement('p', { role: 'alert', className: 'text-red-600' }, error.message);
  if (!data.length) return React.createElement('p', null, 'No clubs found');
  return React.createElement(
    'div',
    { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' },
    data.map((club) =>
      React.createElement(
        'div',
        {
          key: club.id,
          className: 'p-4 border rounded',
          onClick: () => onViewProfile && onViewProfile(club.id),
        },
        club.name
      )
    )
  );
}
