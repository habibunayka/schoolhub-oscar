import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClub, patchClub } from "@services/clubs.js";
import { listCategories } from "@services/clubCategories.js";
import { toast } from "sonner";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, category_id: form.category_id || null };
      await patchClub(id, payload);
      toast.success("Club updated");
      navigate(`/clubs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update club");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Club Settings</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Advisor Name</label>
          <input
            name="advisor_name"
            value={form.advisor_name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
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
          <label className="block mb-1 font-medium">Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
