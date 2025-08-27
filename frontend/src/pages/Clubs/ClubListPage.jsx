import { useQuery } from "@tanstack/react-query";
import { api } from "@lib/api/apiClient";

export default function ClubListPage({ onViewProfile }) {
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await api.get("/clubs");
      return res.data;
    },
  });

  if (isLoading) return <p>Loading clubs...</p>;
  if (error)
    return (
      <p role="alert" className="text-red-600">
        {error.message}
      </p>
    );
  if (!data.length) return <p>No clubs found</p>;

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
