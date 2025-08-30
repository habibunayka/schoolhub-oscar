import React, { useState, useEffect } from "react";
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
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

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
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

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
      if (logoFile) formData.append("logo", logoFile);
      if (bannerFile) formData.append("banner", bannerFile);
      await patchClub(id, formData);
      toast.success("Club updated");
      navigate(`/clubs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update club");
    }
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
              {logoPreview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
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
              {bannerPreview && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full max-h-40 object-cover rounded-lg border"
                  />
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
