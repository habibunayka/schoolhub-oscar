import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import posts from '@services/posts.js';

export default function PostDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => posts.getPost(id),
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error loading post</div>;
  if (!data) return <div className="p-4">Not found</div>;

  return (
    <article className="p-4 space-y-4">
      <div dangerouslySetInnerHTML={{ __html: data.body_html }} />
      {data.images?.length ? (
        <div className="grid grid-cols-2 gap-2">
          {data.images.map((img) => (
            <img key={img} src={img} alt="" className="rounded" />
          ))}
        </div>
      ) : null}
    </article>
  );
}
