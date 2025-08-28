import React, { useState } from 'react';
import { Bell, ArrowLeft, Settings, Calendar, Heart, MessageCircle, Trophy, AlertCircle, Clock, Search } from 'lucide-react';

function NotificationHeader() {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function NotificationItem({ icon, iconBg, title, description, club, time, isUnread = false }) {
  return (
    <div className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${isUnread ? 'border-blue-500 bg-blue-50/30' : 'border-transparent'}`}>
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
            {isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
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
      <div className="bg-white">
        {children}
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const todayNotifications = [
    {
      icon: <Calendar className="w-5 h-5 text-orange-600" />,
      iconBg: "bg-orange-100",
      title: "Event Reminder",
      description: "Basketball Tournament starts in 30 minutes",
      club: "Basketball Club",
      time: "30 minutes ago",
      isUnread: true
    },
    {
      icon: <Heart className="w-5 h-5 text-pink-600" />,
      iconBg: "bg-pink-100",
      title: "New Like",
      description: "Mike Johnson liked your post in Science Lab",
      club: "Science Lab",
      time: "2 hours ago",
      isUnread: true
    }
  ];

  const yesterdayNotifications = [
    {
      icon: <MessageCircle className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
      title: "New Post",
      description: "Drama Club shared a new post about upcoming performance",
      club: "Drama Club",
      time: "Yesterday at 4:30 PM"
    },
    {
      icon: <Trophy className="w-5 h-5 text-yellow-600" />,
      iconBg: "bg-yellow-100",
      title: "Achievement Unlocked",
      description: "You've earned the 'Active Member' badge for participating in 5 events",
      time: "Yesterday at 2:15 PM"
    }
  ];

  const thisWeekNotifications = [
    {
      icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
      iconBg: "bg-orange-100",
      title: "Event Updated",
      description: "Science Fair location has been changed to Main Hall",
      club: "Science Lab",
      time: "3 days ago"
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100",
      title: "New Comment",
      description: "Emma Davis commented on your Basketball Club post",
      club: "Basketball Club",
      time: "4 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Notification Header */}
      <NotificationHeader />

      {/* Notifications Content */}
      <div className="max-w-4xl mx-auto">
        {/* Today Section */}
        <NotificationSection title="Today">
          {todayNotifications.map((notification, index) => (
            <NotificationItem key={index} {...notification} />
          ))}
        </NotificationSection>

        {/* Yesterday Section */}
        <NotificationSection title="Yesterday">
          {yesterdayNotifications.map((notification, index) => (
            <NotificationItem key={index} {...notification} />
          ))}
        </NotificationSection>

        {/* This Week Section */}
        <NotificationSection title="This Week">
          {thisWeekNotifications.map((notification, index) => (
            <NotificationItem key={index} {...notification} />
          ))}
        </NotificationSection>
      </div>
    </div>
  );
}