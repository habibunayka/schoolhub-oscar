import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClub, patchClub } from "@services/clubs.js";
import { listCategories } from "@services/clubCategories.js";
import { toast } from "sonner";
import { getAssetUrl } from "@utils";

export default function ClubSettingsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    advisor_name: "",
    category_id: "",
    location: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [logoScale, setLogoScale] = useState(1);
  const [bannerScale, setBannerScale] = useState(1);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 });
  const [logoDragging, setLogoDragging] = useState(false);
  const [bannerDragging, setBannerDragging] = useState(false);
  const logoLastPoint = useRef({ x: 0, y: 0 });
  const bannerLastPoint = useRef({ x: 0, y: 0 });
  const logoViewportRef = useRef();
  const bannerViewportRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const [club, cats] = await Promise.all([
          getClub(id),
          listCategories(),
        ]);
        setForm({
          name: club.name || "",
          slug: club.slug || "",
          description: club.description || "",
          advisor_name: club.advisor_name || "",
          category_id: club.category_id ? String(club.category_id) : "",
          location: club.location || "",
        });
        setCategories(cats);
        setLogoPreview(getAssetUrl(club.logo_url) || "");
        setBannerPreview(getAssetUrl(club.banner_url) || "");
      } catch (e) {
        console.error(e);
        setError("Failed to load club data");
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedLogo(reader.result);
      setLogoScale(1);
      setLogoPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedBanner(reader.result);
      setBannerScale(1);
      setBannerPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const getClientPoint = (e) => {
    if ("touches" in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleLogoDragStart = (e) => {
    e.preventDefault();
    setLogoDragging(true);
    logoLastPoint.current = getClientPoint(e);
  };

  const handleLogoDragMove = (e) => {
    if (!logoDragging) return;
    e.preventDefault();
    const pt = getClientPoint(e);
    const dx = pt.x - logoLastPoint.current.x;
    const dy = pt.y - logoLastPoint.current.y;
    logoLastPoint.current = pt;
    setLogoPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleLogoDragEnd = () => setLogoDragging(false);

  const handleBannerDragStart = (e) => {
    e.preventDefault();
    setBannerDragging(true);
    bannerLastPoint.current = getClientPoint(e);
  };

  const handleBannerDragMove = (e) => {
    if (!bannerDragging) return;
    e.preventDefault();
    const pt = getClientPoint(e);
    const dx = pt.x - bannerLastPoint.current.x;
    const dy = pt.y - bannerLastPoint.current.y;
    bannerLastPoint.current = pt;
    setBannerPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleBannerDragEnd = () => setBannerDragging(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);
      formData.append("advisor_name", form.advisor_name);
      if (form.category_id) formData.append("category_id", form.category_id);
      if (form.location) formData.append("location", form.location);
      if (selectedLogo && logoViewportRef.current) {
        const canvas = document.createElement("canvas");
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.src = selectedLogo;

        await new Promise((resolve) => (img.onload = resolve));

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        const viewport = logoViewportRef.current;
        const viewportRect = viewport.getBoundingClientRect();
        const viewportSize = 256;
        const ratio = size / viewportSize;
        const imgElement = viewport.querySelector('img');
        if (imgElement) {
          const imgRect = imgElement.getBoundingClientRect();
          const relativeX = (imgRect.left - viewportRect.left) * ratio;
          const relativeY = (imgRect.top - viewportRect.top) * ratio;
          const imgWidth = imgRect.width * ratio;
          const imgHeight = imgRect.height * ratio;
          ctx.drawImage(img, relativeX, relativeY, imgWidth, imgHeight);
        }

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        if (blob) formData.append("logo", blob, "logo.png");
      }

      if (selectedBanner && bannerViewportRef.current) {
        const canvas = document.createElement("canvas");
        const width = 1200;
        const height = 300;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.src = selectedBanner;

        await new Promise((resolve) => (img.onload = resolve));

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        const viewport = bannerViewportRef.current;
        const viewportRect = viewport.getBoundingClientRect();
        const ratio = width / viewportRect.width;
        const imgElement = viewport.querySelector('img');
        if (imgElement) {
          const imgRect = imgElement.getBoundingClientRect();
          const relativeX = (imgRect.left - viewportRect.left) * ratio;
          const relativeY = (imgRect.top - viewportRect.top) * ratio;
          const imgWidth = imgRect.width * ratio;
          const imgHeight = imgRect.height * ratio;
          ctx.drawImage(img, relativeX, relativeY, imgWidth, imgHeight);
        }

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/png")
        );
        if (blob) formData.append("banner", blob, "banner.png");
      }
      await patchClub(id, formData);
      toast.success("Club updated");
      navigate(`/clubs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update club");
    }
  };

  const LogoPreview = ({ selectedImage, scale, position }) => {
    const previewCanvasRef = useRef();

    useEffect(() => {
      if (!selectedImage || !previewCanvasRef.current || !logoViewportRef.current) return;

      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = selectedImage;

      img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 64, 64);

        const viewport = logoViewportRef.current;
        const viewportRect = viewport.getBoundingClientRect();
        const ratio = 64 / 256;

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

  const BannerPreview = ({ selectedImage, scale, position }) => {
    const previewCanvasRef = useRef();

    useEffect(() => {
      if (!selectedImage || !previewCanvasRef.current || !bannerViewportRef.current) return;

      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = selectedImage;

      img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 300, 75);

        const viewport = bannerViewportRef.current;
        const viewportRect = viewport.getBoundingClientRect();
        const ratio = 300 / viewportRect.width;

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
        <div className="w-[300px] h-[75px] overflow-hidden border-2 border-gray-300 bg-white">
          <canvas
            ref={previewCanvasRef}
            width={300}
            height={75}
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
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Club Settings</h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Slug</label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Advisor Name</label>
              <input
                name="advisor_name"
                value={form.advisor_name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              {!selectedLogo && logoPreview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                </div>
              )}
              {selectedLogo && (
                <div className="mt-4 flex flex-col items-center space-y-4">
                  <LogoPreview
                    selectedImage={selectedLogo}
                    scale={logoScale}
                    position={logoPosition}
                  />
                  <div className="text-sm text-gray-500 text-center">
                    Drag untuk memposisikan, slider untuk zoom. Area crop adalah seluruh kotak.
                  </div>
                  <div
                    ref={logoViewportRef}
                    className="relative w-64 h-64 overflow-hidden border-2 border-gray-300 cursor-move bg-white"
                    onMouseDown={handleLogoDragStart}
                    onMouseMove={handleLogoDragMove}
                    onMouseUp={handleLogoDragEnd}
                    onMouseLeave={handleLogoDragEnd}
                    onTouchStart={handleLogoDragStart}
                    onTouchMove={handleLogoDragMove}
                    onTouchEnd={handleLogoDragEnd}
                  >
                    <img
                      src={selectedLogo}
                      alt="New logo"
                      draggable={false}
                      className="absolute pointer-events-none"
                      style={{
                        top: logoPosition.y,
                        left: logoPosition.x,
                        transform: `scale(${logoScale})`,
                        transformOrigin: "top left",
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={logoScale}
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="w-full max-w-md"
                  />
                  <div className="text-xs text-gray-400">Zoom: {logoScale.toFixed(1)}x</div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Banner</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
              {!selectedBanner && bannerPreview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full max-h-40 object-cover rounded-lg border"
                  />
                </div>
              )}
              {selectedBanner && (
                <div className="mt-4 flex flex-col items-center space-y-4">
                  <BannerPreview
                    selectedImage={selectedBanner}
                    scale={bannerScale}
                    position={bannerPosition}
                  />
                  <div className="text-sm text-gray-500 text-center">
                    Drag untuk memposisikan, slider untuk zoom. Area crop adalah seluruh kotak.
                  </div>
                  <div
                    ref={bannerViewportRef}
                    className="relative w-[600px] h-[150px] overflow-hidden border-2 border-gray-300 cursor-move bg-white"
                    onMouseDown={handleBannerDragStart}
                    onMouseMove={handleBannerDragMove}
                    onMouseUp={handleBannerDragEnd}
                    onMouseLeave={handleBannerDragEnd}
                    onTouchStart={handleBannerDragStart}
                    onTouchMove={handleBannerDragMove}
                    onTouchEnd={handleBannerDragEnd}
                  >
                    <img
                      src={selectedBanner}
                      alt="New banner"
                      draggable={false}
                      className="absolute pointer-events-none"
                      style={{
                        top: bannerPosition.y,
                        left: bannerPosition.x,
                        transform: `scale(${bannerScale})`,
                        transformOrigin: "top left",
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={bannerScale}
                    onChange={(e) => setBannerScale(Number(e.target.value))}
                    className="w-full max-w-md"
                  />
                  <div className="text-xs text-gray-400">Zoom: {bannerScale.toFixed(1)}x</div>
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
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
