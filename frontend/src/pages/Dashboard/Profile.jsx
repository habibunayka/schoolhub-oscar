import React, { useRef, useState } from "react";
import {
    Calendar,
    MapPin,
    Edit3,
    Camera,
    Trophy,
    Users,
    Activity,
    ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import auth from "@services/auth.js";
import { getJoinedClubs } from "@services/clubs.js";
import { listAllEvents } from "@services/events.js";
import { getUserStats, getAchievements, updateProfile } from "@services/users.js";
import { getAssetUrl } from "@utils";
import SafeImage from "@/components/SafeImage";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@components/common/ui/feedback";
import { formatDateOnly } from "@/utils/date";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { data: user } = useQuery({ queryKey: ["me"], queryFn: auth.me });
    const { data: clubs } = useQuery({ queryKey: ["myClubs"], queryFn: getJoinedClubs });
    const { data: events } = useQuery({ queryKey: ["events"], queryFn: listAllEvents });
    const { data: stats } = useQuery({ queryKey: ["userStats"], queryFn: getUserStats });
    const { data: achievements } = useQuery({ queryKey: ["achievements"], queryFn: getAchievements });
    const queryClient = useQueryClient();
    const avatarInputRef = useRef();
    const avatarMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            queryClient.setQueryData(["me"], data);
        },
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [scale, setScale] = useState(1);
    const [isEditing, setIsEditing] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result);
            setIsEditing(true);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveAvatar = () => {
        if (!selectedImage) return;
        const canvas = document.createElement("canvas");
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.src = selectedImage;
        img.onload = async () => {
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const dx = (size - scaledWidth) / 2;
            const dy = (size - scaledHeight) / 2;
            ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);
            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
            if (blob) {
                const formData = new FormData();
                formData.append("avatar", blob, "avatar.png");
                avatarMutation.mutate(formData);
            }
            setIsEditing(false);
            setScale(1);
            setSelectedImage(null);
        };
    };

    const activeClubsCount = Array.isArray(clubs) ? clubs.length : 0;
    const eventsJoinedCount = Array.isArray(events) ? events.length : 0;
    const activityPoints = stats?.activity_points ?? 0;
    const achievementsCount = stats?.achievements_count ?? 0;

    return (
        <>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Avatar</DialogTitle>
                    </DialogHeader>
                    {selectedImage && (
                        <div className="flex flex-col items-center space-y-4">
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
                    <DialogFooter>
                        <DialogClose className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            Cancel
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleSaveAvatar}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                {/* Back Button */}
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start space-x-6">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                                {user?.avatar_url ? (
                                    <SafeImage
                                        src={getAssetUrl(user.avatar_url)}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white text-4xl font-bold">
                                        {user?.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl"
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                <Camera className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {user?.name || "Loading..."}
                            </h1>
                            <p className="text-gray-600 text-lg mb-3">
                                {user
                                    ? `Role: ${user.role_global}`
                                    : "Fetching profile..."}
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                {user?.bio || "No bio provided."}
                            </p>

                            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDateOnly(user?.joined_at) || "-"}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{user?.location || "-"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                            onClick={() => navigate("/profile/edit")}
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {activeClubsCount}
                            </div>
                            <div className="text-sm text-gray-600">Active Clubs</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {eventsJoinedCount}
                            </div>
                            <div className="text-sm text-gray-600">Events Joined</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {activityPoints}
                            </div>
                            <div className="text-sm text-gray-600">Activity Points</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {achievementsCount}
                            </div>
                            <div className="text-sm text-gray-600">Achievements</div>
                        </div>
                    </div>
                </div>

                {/* My Clubs */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Clubs</h3>
                    <div className="space-y-3">

                        {Array.isArray(clubs) &&
                            clubs.map((club) => (
                                <div
                                    key={club.id}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        {club.logo_url ? (
                                            <SafeImage
                                                src={getAssetUrl(club.logo_url)}
                                                alt={club.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl">
                                                {club.name?.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                            {club.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {club.category_name || club.role || "Member"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Achievements
                    </h3>
                    <div className="space-y-3">
                        {Array.isArray(achievements) &&
                            achievements.slice(0, 3).map((ach) => (
                                <div
                                    key={ach.id}
                                    className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
                                >
                                    <Trophy className="w-8 h-8 text-yellow-600" />
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {ach.title}
                                        </div>
                                        {ach.description && (
                                            <div className="text-sm text-gray-500">
                                                {ach.description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {Array.isArray(events) &&
                            events.slice(0, 3).map((ev) => (
                                <div
                                    key={ev.id}
                                    className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg"
                                >
                                    <Activity className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <div className="font-medium">
                                            {ev.title || ev.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {ev.start_at || ev.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}
