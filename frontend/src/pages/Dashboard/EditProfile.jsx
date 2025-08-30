import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import auth from "@services/auth.js";
import { updateProfile } from "@services/users.js";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: auth.me });
  const [form, setForm] = useState({ name: "", bio: "", location: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const viewportRef = useRef();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data);
      navigate("/profile");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const getClientPoint = (e) => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    setDragging(true);
    lastPoint.current = getClientPoint(e);
  };

  const handleDragMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const pt = getClientPoint(e);
    const dx = pt.x - lastPoint.current.x;
    const dy = pt.y - lastPoint.current.y;
    lastPoint.current = pt;
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleDragEnd = () => setDragging(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("bio", form.bio);
    formData.append("location", form.location);

    if (selectedImage && viewportRef.current) {
      const canvas = document.createElement("canvas");
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      
      const img = new Image();
      img.src = selectedImage;
      
      await new Promise((resolve) => (img.onload = resolve));
      
      // Clear canvas with white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      
      // Viewport adalah 256x256, kita ambil bagian center sebagai crop area
      const viewport = viewportRef.current;
      const viewportRect = viewport.getBoundingClientRect();
      const viewportSize = 256; // ukuran viewport dalam pixel CSS
      
      // Ratio untuk convert dari CSS pixel ke canvas pixel
      const ratio = size / viewportSize;
      
      // Posisi dan ukuran image di dalam viewport
      const imgElement = viewport.querySelector('img');
      if (imgElement) {
        const imgRect = imgElement.getBoundingClientRect();
        const relativeX = (imgRect.left - viewportRect.left) * ratio;
        const relativeY = (imgRect.top - viewportRect.top) * ratio;
        const imgWidth = imgRect.width * ratio;
        const imgHeight = imgRect.height * ratio;
        
        // Draw image ke canvas
        ctx.drawImage(img, relativeX, relativeY, imgWidth, imgHeight);
      }

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (blob) formData.append("avatar", blob, "avatar.png");
    }

    await mutation.mutateAsync(formData);
  };

  const AvatarPreview = ({ selectedImage, scale, position }) => {
    const previewCanvasRef = useRef();

    useEffect(() => {
      if (!selectedImage || !previewCanvasRef.current || !viewportRef.current) return;

      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = selectedImage;

      img.onload = () => {
        // Clear canvas
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 64, 64);

        // Sama seperti handleSubmit tapi untuk preview kecil
        const viewport = viewportRef.current;
        const viewportRect = viewport.getBoundingClientRect();
        const ratio = 64 / 256; // preview 64px, viewport 256px
        
        const imgElement = viewport.querySelector('img');
        if (imgElement) {
          const imgRect = imgElement.getBoundingClientRect();
          const relativeX = (imgRect.left - viewportRect.left) * ratio;
          const relativeY = (imgRect.top - viewportRect.top) * ratio;
          const imgWidth = imgRect.width * ratio;
          const imgHeight = imgRect.height * ratio;
          
          ctx.drawImage(img, relativeX, relativeY, imgWidth, imgHeight);
        }
      };
    }, [selectedImage, scale, position]);

    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">Preview hasil:</div>
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 bg-white">
          <canvas
            ref={previewCanvasRef}
            width={64}
            height={64}
            className="w-full h-full"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Edit Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              {selectedImage && (
                <div className="mt-4 flex flex-col items-center space-y-4">
                  <AvatarPreview
                    selectedImage={selectedImage}
                    scale={scale}
                    position={position}
                  />
                  <div className="text-sm text-gray-500 text-center">
                    Drag untuk memposisikan, slider untuk zoom. Area crop adalah seluruh kotak.
                  </div>
                  <div
                    ref={viewportRef}
                    className="relative w-64 h-64 overflow-hidden border-2 border-gray-300 cursor-move bg-white"
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                  >
                    <img
                      src={selectedImage}
                      alt="New avatar"
                      draggable={false}
                      className="absolute pointer-events-none"
                      style={{
                        top: position.y,
                        left: position.x,
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full max-w-md"
                  />
                  <div className="text-xs text-gray-400">
                    Zoom: {scale.toFixed(1)}x
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}