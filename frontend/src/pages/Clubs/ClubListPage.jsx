import { useQuery } from "@tanstack/react-query";
import { listClubs } from "@lib/api/services/clubs";
import ApiError from "@components/common/ApiError";
import EmptyState from "@components/common/EmptyState";

export default function ClubListPage({ onViewProfile }) {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clubs"],
    queryFn: () => listClubs(),
  });

  if (isLoading) return <p>Loading clubs...</p>;
  if (error) return <ApiError error={error} />;
  if (!data.length) return <EmptyState message="No clubs found" />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((club) => (
        <div
          key={club.id}
          className="p-4 border rounded"
          onClick={() => onViewProfile && onViewProfile(club.id)}
        >
          {club.name}
        </div>
      ))}
    </div>
  );
}
