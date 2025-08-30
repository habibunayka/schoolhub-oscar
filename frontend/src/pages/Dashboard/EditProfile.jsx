import React, { useEffect, useState } from "react";
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
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("bio", form.bio);
        formData.append("location", form.location);

        if (selectedImage) {
            const canvas = document.createElement("canvas");
            const size = 256;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.src = selectedImage;
            await new Promise((resolve) => (img.onload = resolve));
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const dx = (size - scaledWidth) / 2;
            const dy = (size - scaledHeight) / 2;
            ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
            if (blob) formData.append("avatar", blob, "avatar.png");
        }

        await mutation.mutateAsync(formData);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">Edit Profile</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Bio</label>
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            />
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
                            <label className="block text-sm font-medium mb-1 text-gray-700">Avatar</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                            {selectedImage && (
                                <div className="mt-4 flex flex-col items-center space-y-2">
                                    <div className="w-40 h-40 rounded-full overflow-hidden">
                                        <img
                                            src={selectedImage}
                                            alt="New avatar"
                                            style={{ transform: `scale(${scale})` }}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={scale}
                                        onChange={(e) => setScale(Number(e.target.value))}
                                        className="w-full"
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
                                disabled={mutation.isLoading}
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
