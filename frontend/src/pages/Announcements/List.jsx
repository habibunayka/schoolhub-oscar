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
    <ul className="max-w-2xl mx-auto space-y-2">
      {data.map((a) => (
        <li key={a.id} className="bg-white p-4 rounded shadow">
          <Link
            to={`/announcements/${a.id}`}
            className="text-blue-600 hover:underline"
          >
            {a.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
