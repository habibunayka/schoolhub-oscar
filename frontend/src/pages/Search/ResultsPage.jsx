import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clubs from "@services/clubs.js";
import SafeImage from "@/components/SafeImage"; // pake yg udah kita bikin
import { Card, CardContent } from "@/components/common/ui/data-display/Card";
import { Loader2 } from "lucide-react";

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: () => clubs.listClubs({ search: query }),
    enabled: query.length > 0,
  });

  if (!query) {
    return <div className="p-4 text-gray-500">Please enter a search query.</div>;
  }

  if (isLoading) {
    return (
      <div className="p-4 flex items-center gap-2 text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error fetching results</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">
        Search results for <span className="text-blue-600">"{query}"</span>
      </h1>

      {data.length === 0 ? (
        <div className="text-gray-500">No results found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((club) => (
            <Link key={club.id} to={`/clubs/${club.id}`}>
              <Card className="hover:shadow-md transition">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <SafeImage
                      src={club.image}
                      alt={club.name}
                      wrapperClassName="w-full h-full rounded-lg"
                      className="w-full h-full object-cover"
                      sizePx={48}
                      placeholderSize={24}
                    />
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-800">{club.name}</h2>
                    {club.category && (
                      <p className="text-sm text-gray-500">{club.category}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
