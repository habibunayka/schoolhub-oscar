import React, { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  listClubs,
  createClub,
  patchClub,
  deleteClub,
  getClub,
} from "@services/clubs.js";
import { listCategories } from "@services/clubCategories.js";
import { searchUsers } from "@services/users.js";
import useConfirm from "@hooks/useConfirm.jsx";

export default function ClubCrudPage() {
  const [clubs, setClubs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    leader_name: "",
    category_id: "",
    description: "",
  });
  const [userOptions, setUserOptions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const { confirm, ConfirmDialog } = useConfirm();

  useEffect(() => {
    async function init() {
      try {
        const [clubData, catData, userData] = await Promise.all([
          listClubs(),
          listCategories(),
          searchUsers(""),
        ]);
        setClubs(clubData);
        setCategories(catData);
        setUserOptions(userData);
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLeaderSelect = (e) => {
    setForm({ ...form, leader_name: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      leader_name: "",
      category_id: "",
      description: "",
    });
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        advisor_name: form.leader_name,
        category_id: form.category_id || null,
      };
      delete payload.leader_name;
      if (editingId) {
        await patchClub(editingId, payload);
        const updated = await getClub(editingId);
        setClubs((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        toast.success("Club updated");
      } else {
        const { id } = await createClub(payload);
        const created = await getClub(id);
        setClubs((prev) => [...prev, created]);
        toast.success("Club created");
      }
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit");
    }
  };

  const handleEdit = (club) => {
    setEditingId(club.id);
    setForm({
      name: club.name || "",
      slug: club.slug || "",
      leader_name: club.advisor_name || "",
      category_id: club.category_id || "",
      description: club.description || "",
    });
    if (
      club.advisor_name &&
      !userOptions.some((u) => u.name === club.advisor_name)
    ) {
      setUserOptions((prev) => [
        ...prev,
        { id: `club-${club.id}-leader`, name: club.advisor_name },
      ]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!(await confirm("Delete this club?"))) return;
    try {
      await deleteClub(id);
      setClubs((prev) => prev.filter((c) => c.id !== id));
      toast.success("Club deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete club");
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Clubs</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8 space-y-4"
        >
          {error && <p className="text-red-600">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Leader</label>
              <select
                name="leader_name"
                value={form.leader_name}
                onChange={handleLeaderSelect}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">Select leader</option>
                {userOptions.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="space-y-4">
          {clubs.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{c.name}</h2>
                  {c.category_name && (
                    <p className="text-sm text-gray-500">{c.category_name}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1 text-sm border border-blue-300 text-blue-700 rounded hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {c.description && (
                <p className="mt-2 text-gray-700">{c.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

