import React, { useState } from 'react';
import { Search, Plus, Calendar, MapPin, Heart, MessageCircle, Share, Bell, Edit3, Settings, Camera, Trophy, Users, Activity } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">AX</span>
                </div>
                <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Alex Rodriguez</h1>
                <p className="text-gray-600 text-lg mb-3">Computer Science Student • Jakarta, Indonesia</p>
                <p className="text-gray-700 max-w-2xl leading-relaxed">
                  Passionate about technology, sports, and creative arts. Love connecting with like-minded people 
                  and exploring new opportunities for growth and learning.
                </p>
                
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined March 2024</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Jakarta, Indonesia</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Stats & Info */}
          <div className="col-span-4 space-y-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600">Active Clubs</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">28</div>
                  <div className="text-sm text-gray-600">Events Joined</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">342</div>
                  <div className="text-sm text-gray-600">Activity Points</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">12</div>
                  <div className="text-sm text-gray-600">Achievements</div>
                </div>
              </div>
            </div>

            {/* My Clubs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Clubs</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">🏀</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Basketball Club</div>
                    <div className="text-sm text-gray-500">Team Captain</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">🎭</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Drama Club</div>
                    <div className="text-sm text-gray-500">Active Member</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">🔬</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Science Lab</div>
                    <div className="text-sm text-gray-500">Research Assistant</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">📷</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Photography Club</div>
                    <div className="text-sm text-gray-500">Member</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-xl">🤖</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Robotics Club</div>
                    <div className="text-sm text-gray-500">Treasurer</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-600" />
                  <div>
                    <div className="font-medium text-gray-900">Tournament Winner</div>
                    <div className="text-sm text-gray-500">Basketball Championship</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">Best Performance</div>
                    <div className="text-sm text-gray-500">Drama Festival</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Trophy className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Innovation Award</div>
                    <div className="text-sm text-gray-500">Science Fair</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-8">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setActiveTab('posts')}
                  className={`px-6 py-4 font-medium ${activeTab === 'posts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Posts
                </button>
                <button 
                  onClick={() => setActiveTab('activities')}
                  className={`px-6 py-4 font-medium ${activeTab === 'activities' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Activities
                </button>
                <button 
                  onClick={() => setActiveTab('photos')}
                  className={`px-6 py-4 font-medium ${activeTab === 'photos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Photos
                </button>
                <button 
                  onClick={() => setActiveTab('achievements')}
                  className={`px-6 py-4 font-medium ${activeTab === 'achievements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Achievements
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {/* Create Post */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">AX</span>
                    </div>
                    <input
                      type="text"
                      placeholder="What's on your mind, Alex?"
                      className="flex-1 px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Post
                    </button>
                  </div>
                </div>

                {/* Posts */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">AX</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Alex Rodriguez</div>
                      <div className="text-sm text-gray-500">2 days ago</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-4">
                    Just finished an amazing basketball practice session! Our team is getting ready for the championship next week. 
                    The energy and teamwork today was incredible. Can't wait to show what we've been working on! 🏀🔥
                  </p>
                  
                  <div className="mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Basketball practice"
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-6 text-gray-500">
                    <button className="flex items-center space-x-2 hover:text-red-500">
                      <Heart className="w-5 h-5" />
                      <span>32</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-500">
                      <MessageCircle className="w-5 h-5" />
                      <span>8</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-gray-700">
                      <Share className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">AX</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Alex Rodriguez</div>
                      <div className="text-sm text-gray-500">1 week ago</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-4">
                    Had an incredible time at the Science Fair today! Our robotics project won the innovation award. 
                    So proud of my team and all the hard work we put in over the past months. 🤖🏆
                  </p>
                  
                  <div className="mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Science Fair"
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-6 text-gray-500">
                    <button className="flex items-center space-x-2 hover:text-red-500">
                      <Heart className="w-5 h-5" />
                      <span>45</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-blue-500">
                      <MessageCircle className="w-5 h-5" />
                      <span>12</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-gray-700">
                      <Share className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">Won Basketball Championship Tournament</p>
                      <p className="text-sm text-gray-500">Basketball Club • 3 days ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">Performed in Annual Drama Festival</p>
                      <p className="text-sm text-gray-500">Drama Club • 1 week ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">Received Innovation Award at Science Fair</p>
                      <p className="text-sm text-gray-500">Science Lab • 1 week ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">Photography Exhibition Opening</p>
                      <p className="text-sm text-gray-500">Photography Club • 2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Photo Gallery</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <img 
                    src="https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="Basketball"
                    className="aspect-square object-cover rounded-lg hover:opacity-90 cursor-pointer"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="Science"
                    className="aspect-square object-cover rounded-lg hover:opacity-90 cursor-pointer"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="Drama"
                    className="aspect-square object-cover rounded-lg hover:opacity-90 cursor-pointer"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="Photography"
                    className="aspect-square object-cover rounded-lg hover:opacity-90 cursor-pointer"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="Robotics"
                    className="aspect-square object-cover rounded-lg hover:opacity-90 cursor-pointer"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                    alt="Team"
                    className="aspect-square object-cover rounded-lg hover:opacity-90 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">All Achievements</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-yellow-50 rounded-lg text-center">
                    <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900">Tournament Winner</h4>
                    <p className="text-sm text-gray-600">Basketball Championship</p>
                    <span className="text-xs text-gray-500">March 2024</span>
                  </div>
                  
                  <div className="p-6 bg-purple-50 rounded-lg text-center">
                    <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900">Best Performance</h4>
                    <p className="text-sm text-gray-600">Drama Festival</p>
                    <span className="text-xs text-gray-500">March 2024</span>
                  </div>
                  
                  <div className="p-6 bg-blue-50 rounded-lg text-center">
                    <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900">Innovation Award</h4>
                    <p className="text-sm text-gray-600">Science Fair</p>
                    <span className="text-xs text-gray-500">March 2024</span>
                  </div>
                  
                  <div className="p-6 bg-green-50 rounded-lg text-center">
                    <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900">Photo Contest</h4>
                    <p className="text-sm text-gray-600">Photography Club</p>
                    <span className="text-xs text-gray-500">February 2024</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}