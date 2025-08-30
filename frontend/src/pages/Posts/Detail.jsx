import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import posts from "@services/posts.js";
import SafeImage from "@components/SafeImage";
import { Globe, Users, Lock, Heart, MessageCircle, Share } from "lucide-react";
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

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (data) {
      setLikes(data.likes_count || 0);
      setIsLiked(!!data.liked);
    }
  }, [data]);

  useEffect(() => {
    posts.listComments(id).then(setComments).catch(console.error);
  }, [id]);

  const handleLike = async () => {
    try {
      const { likes_count } = isLiked
        ? await posts.unlikePost(id)
        : await posts.likePost(id);
      setIsLiked(!isLiked);
      setLikes(likes_count);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/posts/${id}`;
    if (navigator.share) {
      navigator.share({ url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Link copied to clipboard");
      });
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const comment = await posts.createComment(id, newComment);
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (e) {
      console.error(e);
    }
  };

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
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-1 text-sm text-gray-600"
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                />
                <span>{likes}</span>
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("comments");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-1 text-sm text-gray-600"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length}</span>
              </button>
              <button
                onClick={handleShare}
                className="text-gray-600"
              >
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div id="comments" className="mt-6">
          <h4 className="font-medium mb-2">Comments</h4>
          <ul className="space-y-4 mb-4">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <SafeImage
                  src={getAssetUrl(c.author_avatar)}
                  alt={c.author_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{c.author_name}</p>
                  <div
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: c.body_html }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-sm"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

