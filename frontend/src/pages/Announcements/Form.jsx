import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import announcements from "@services/announcements.js";

export default function AnnouncementForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ["announcements", id],
    queryFn: () => announcements.get(id),
    enabled: editing,
  });

  const [form, setForm] = useState({
    club_id: "",
    title: "",
    content_html: "",
    target: "all",
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      editing ? announcements.update(id, payload) : announcements.create(payload),
    onSuccess: () => {
      qc.invalidateQueries(["announcements:list"]);
      navigate("/announcements");
    },
  });

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(form);
      }}
    >
      <input
        name="club_id"
        placeholder="Club ID"
        value={form.club_id}
        onChange={onChange}
        required
      />
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={onChange}
        required
      />
      <textarea
        name="content_html"
        placeholder="Content"
        value={form.content_html}
        onChange={onChange}
        required
      />
      <select name="target" value={form.target} onChange={onChange}>
        <option value="all">All</option>
        <option value="members">Members</option>
        <option value="public">Public</option>
        <option value="admins">Admins</option>
      </select>
      <button type="submit" disabled={mutation.isLoading}>
        {editing ? "Update" : "Create"}
      </button>
    </form>
  );
}
