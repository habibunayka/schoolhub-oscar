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
    // TODO : bagusin style ini.
    <article>
      <h1>{data.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.content_html }} />
    </article>
  );
}
