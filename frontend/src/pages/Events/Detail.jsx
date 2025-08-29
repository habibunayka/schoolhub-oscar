import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import events from '@services/events.js';

export default function EventDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => events.getEvent(id),
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error loading event</div>;
  if (!data) return <div className="p-4">Not found</div>;

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      <p className="text-gray-600 text-sm">
        {(() => {
          const d = new Date(data.start_at);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
          return `${year}-${month}-${day} ${time}`;
        })()} • {data.location}
      </p>
      <p>{data.description}</p>
    </div>
  );
}
