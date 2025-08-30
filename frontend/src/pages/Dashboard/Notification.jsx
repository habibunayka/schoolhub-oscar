import React, { useEffect, useState } from "react";
import {
    Bell,
    ArrowLeft,
    Settings,
    Calendar,
    MessageCircle,
    AlertCircle,
    Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/client.js";
import { triggerNotificationsUpdate } from "../../hooks/useUnreadNotifications.js";

function NotificationHeader() {
    const navigate = useNavigate(); // ✅ inisialisasi hook
    return (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex items-center space-x-3">
                        <Bell className="w-6 h-6 text-blue-600" />
                        <h1 className="text-xl font-semibold text-gray-900">
                            Notifications
                        </h1>
                    </div>
                </div>
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => navigate('/settings')}
                >
                    <Settings className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
}

function NotificationItem({
    icon,
    iconBg,
    title,
    description,
    club,
    time,
    isUnread = false,
}) {
    return (
        <div
            className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${isUnread ? "border-blue-500 bg-blue-50/30" : "border-transparent"}`}
        >
            <div className="flex items-start space-x-3">
                <div
                    className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {title}
                        </h3>
                        {isUnread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{description}</p>
                    {club && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md mb-2">
                            {club}
                        </span>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {time}
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotificationSection({ title, children }) {
    return (
        <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide px-6 py-3 bg-gray-50">
                {title}
            </h2>
            <div className="bg-white">{children}</div>
        </div>
    );
}

export default function NotificationsPage() {
    const [grouped, setGrouped] = useState({
        today: [],
        yesterday: [],
        thisWeek: [],
    });

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get("/notifications", { params: { limit: 100 } });
                const list = res.data.data || [];
                const groupedData = groupByDate(list);
                setGrouped(groupedData);
                await api.post("/notifications/read-all");
                triggerNotificationsUpdate();
            } catch (err) {
                console.error(err);
            }
        };
        fetchNotifications();
    }, []);

    const isEmpty =
        grouped.today.length === 0 &&
        grouped.yesterday.length === 0 &&
        grouped.thisWeek.length === 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <NotificationHeader />
            <div className="max-w-4xl mx-auto">
                {isEmpty ? (
                    <div className="text-center py-16">
                        <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No notifications</p>
                    </div>
                ) : (
                    <>
                        {grouped.today.length > 0 && (
                            <NotificationSection title="Today">
                                {grouped.today.map((notification, index) => (
                                    <NotificationItem key={index} {...notification} />
                                ))}
                            </NotificationSection>
                        )}
                        {grouped.yesterday.length > 0 && (
                            <NotificationSection title="Yesterday">
                                {grouped.yesterday.map((notification, index) => (
                                    <NotificationItem key={index} {...notification} />
                                ))}
                            </NotificationSection>
                        )}
                        {grouped.thisWeek.length > 0 && (
                            <NotificationSection title="This Week">
                                {grouped.thisWeek.map((notification, index) => (
                                    <NotificationItem key={index} {...notification} />
                                ))}
                            </NotificationSection>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function timeAgo(date) {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} minutes ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
}

function mapNotification(n) {
    const createdAt = new Date(n.created_at);
    const base = {
        time: timeAgo(createdAt),
        isUnread: !n.is_read,
    };
    const p = n.payload || {};
    switch (n.type) {
        case "event_created":
            return {
                ...base,
                icon: <Calendar className="w-5 h-5 text-orange-600" />,
                iconBg: "bg-orange-100",
                title: "New Event",
                description: p.event_title,
                club: p.club_name,
            };
        case "club_announcement":
            return {
                ...base,
                icon: <AlertCircle className="w-5 h-5 text-blue-600" />,
                iconBg: "bg-blue-100",
                title: "Club Announcement",
                description: p.title,
                club: p.club_name,
            };
        case "school_announcement":
            return {
                ...base,
                icon: <AlertCircle className="w-5 h-5 text-purple-600" />,
                iconBg: "bg-purple-100",
                title: "School Announcement",
                description: p.title,
            };
        case "post_created":
            return {
                ...base,
                icon: <MessageCircle className="w-5 h-5 text-green-600" />,
                iconBg: "bg-green-100",
                title: "New Post",
                description: `New post in ${p.club_name}`,
                club: p.club_name,
            };
        default:
            return {
                ...base,
                icon: <AlertCircle className="w-5 h-5 text-gray-600" />,
                iconBg: "bg-gray-100",
                title: n.type,
                description: p.title || "",
            };
    }
}

function groupByDate(list) {
    const today = [];
    const yesterday = [];
    const thisWeek = [];
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    for (const n of list) {
        const createdAt = new Date(n.created_at);
        const mapped = mapNotification(n);
        if (createdAt >= startOfToday) today.push(mapped);
        else if (createdAt >= startOfYesterday) yesterday.push(mapped);
        else if (createdAt >= startOfWeek) thisWeek.push(mapped);
    }
    return { today, yesterday, thisWeek };
}
