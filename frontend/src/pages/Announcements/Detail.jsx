import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import announcements from "@services/announcements.js";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["announcements", id],
    queryFn: () => announcements.get(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading announcement</div>;
  if (!data) return <div>Not found</div>;


  return (
    <article className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: data.content_html }}
      />
    </article>
  );
}
