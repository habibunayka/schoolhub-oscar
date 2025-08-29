import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import announcements from "@services/announcements.js";

export default function AnnouncementsList() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["announcements:list"],
    queryFn: () => announcements.list(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading announcements</div>;
  if (!data.length) return <div>No announcements</div>;

  return (
    <ul>
      {data.map((a) => (
        <li key={a.id}>
          <Link to={`/announcements/${a.id}`}>{a.title}</Link>
        </li>
      ))}
    </ul>
  );
}
