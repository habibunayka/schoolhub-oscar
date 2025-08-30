import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import posts from "@services/posts.js";
import SafeImage from "@components/SafeImage";
import { Globe, Users, Lock } from "lucide-react";
import { getAssetUrl } from "@utils";

const VISIBILITY_MAP = {
  public: { label: "Public", icon: Globe, color: "text-green-600" },
  members_only: { label: "Members Only", icon: Users, color: "text-blue-600" },
  private: { label: "Private", icon: Lock, color: "text-red-600" },
};

export default function PostDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => posts.getPost(id),
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error loading post</div>;
  if (!data) return <div className="p-4">Not found</div>;

  const visibility = VISIBILITY_MAP[data.visibility] || VISIBILITY_MAP.public;
  const images = data.images?.map((img) => getAssetUrl(img)) || [];

  return (
    <article className="p-4">
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-start gap-3">
          <SafeImage
            src={getAssetUrl(data.author_avatar)}
            alt={data.author_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900">
                {data.author_name || "Unknown"}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(data.created_at).toLocaleString()}
              </span>
              <div className="flex items-center gap-1">
                <visibility.icon className={`w-3 h-3 ${visibility.color}`} />
                <span className="text-xs text-gray-500">
                  {visibility.label}
                </span>
              </div>
            </div>
            {data.body_html && (
              <div
                className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-3"
                dangerouslySetInnerHTML={{ __html: data.body_html }}
              />
            )}
            {images.length > 0 && (
              <div
                className={`grid gap-2 ${
                  images.length === 1
                    ? "grid-cols-1"
                    : images.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-2 md:grid-cols-3"
                }`}
              >
                {images.slice(0, 6).map((img, idx) => (
                  <div key={img} className="relative">
                    <SafeImage
                      src={img}
                      alt={`Post image ${idx + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    {idx === 5 && images.length > 6 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                        <span className="text-white font-medium">
                          +{images.length - 6} more
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

