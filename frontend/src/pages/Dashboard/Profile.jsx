import React from "react";
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
import { useQuery } from "@tanstack/react-query";
import auth from "@services/auth.js";

export default function ProfilePage() {
    const navigate = useNavigate();
    const { data: user } = useQuery({ queryKey: ["me"], queryFn: auth.me });

    return (
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
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend belum ada, buatkan. */}
                                <span className="text-white text-4xl font-bold">
                                    AX
                                </span>
                            </div>
                            <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl">
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
                                {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend belum ada, buatkan. */}
                                Passionate about technology, sports, and
                                creative arts. Love connecting with like-minded
                                people and exploring new opportunities for
                                growth and learning.
                            </p>

                            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4" />
                                    {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend belum ada, buatkan. */}
                                    <span>Joined March 2024</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4" />
                                    {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend belum ada, buatkan. */}
                                    <span>Jakarta, Indonesia</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
                            <Edit3 className="w-4 h-4" />
                            {/* TODO : Ubah data ini agar bekerja dan buat pages edit profilenya, jika di backend belum ada, buatkan. */}
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* TODO : Untuk sistem yang belum ada seperti activity point dan achievements itu buat sistem dan crud nya juga di backend, research aja dlu yang menurut lu pas atau cocok buat sistem ini taruh dimana, pokoknya harus bisa nambahin point activity dari join club, partisipasi event, dan peroleh achievement. Kalau achievement dibuat oleh admin club dan dikasih oleh admin klub nya. */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Statistics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend dan table belum ada, buatkan. */}
                            <div className="text-2xl font-bold text-blue-600">
                                5
                            </div>
                            <div className="text-sm text-gray-600">
                                Active Clubs
                            </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend dan table belum ada, buatkan. */}
                            <div className="text-2xl font-bold text-green-600">
                                28
                            </div>
                            <div className="text-sm text-gray-600">
                                Events Joined
                            </div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend dan table belum ada, buatkan. */}
                            <div className="text-2xl font-bold text-orange-600">
                                342
                            </div>
                            <div className="text-sm text-gray-600">
                                Activity Points
                            </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend dan table belum ada, buatkan. */}
                            <div className="text-2xl font-bold text-purple-600">
                                12
                            </div>
                            <div className="text-sm text-gray-600">
                                Achievements
                            </div>
                        </div>
                    </div>
                </div>

                {/* My Clubs */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend belum ada, buatkan. */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        My Clubs
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-orange-600 text-xl">
                                    🏀
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Basketball Club
                                </div>
                                <div className="text-sm text-gray-500">
                                    Team Captain
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600 text-xl">
                                    🎭
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Drama Club
                                </div>
                                <div className="text-sm text-gray-500">
                                    Active Member
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 text-xl">
                                    🔬
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    Science Lab
                                </div>
                                <div className="text-sm text-gray-500">
                                    Research Assistant
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend belum ada, buatkan. */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Achievements
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                            <Trophy className="w-8 h-8 text-yellow-600" />
                            <div>
                                <div className="font-medium text-gray-900">
                                    Tournament Winner
                                </div>
                                <div className="text-sm text-gray-500">
                                    Basketball Championship
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                            <Trophy className="w-8 h-8 text-purple-600" />
                            <div>
                                <div className="font-medium text-gray-900">
                                    Best Performance
                                </div>
                                <div className="text-sm text-gray-500">
                                    Drama Festival
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend belum ada, buatkan. */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                            <Activity className="w-8 h-8 text-blue-600" />
                            <div>
                                <div className="font-medium">
                                    Joined Basketball Club practice
                                </div>
                                <div className="text-sm text-gray-500">
                                    3 hours ago
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                            <Trophy className="w-8 h-8 text-green-600" />
                            <div>
                                <div className="font-medium">
                                    Achieved Tournament Winner badge
                                </div>
                                <div className="text-sm text-gray-500">
                                    2 days ago
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg">
                            <Users className="w-8 h-8 text-purple-600" />
                            <div>
                                <div className="font-medium">
                                    Attended Drama Club meeting
                                </div>
                                <div className="text-sm text-gray-500">
                                    1 week ago
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
