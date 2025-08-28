import React, { useState, useEffect, useMemo } from 'react';

// Dummy data
// TODO : Ubah data ini jadi fetch data asli dari backend, jika di backend belum ada, buatkan.
const DUMMY_CLUBS = [
  {
    id: 1,
    name: "Programming Club",
    description: "Learn coding, build projects, and connect with fellow developers. We focus on web development, mobile apps, and competitive programming.",
    category: "Technology",
    members: 145,
    logoUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop&crop=center",
    isJoined: true
  },
  {
    id: 2,
    name: "Drama Society",
    description: "Express yourself through theater, acting, and stage performance. Join us for workshops, rehearsals, and amazing productions.",
    category: "Arts",
    members: 89,
    logoUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=100&h=100&fit=crop&crop=center",
    isJoined: false
  },
  {
    id: 3,
    name: "Environmental Club",
    description: "Make a difference in our planet's future. Organize clean-up drives, sustainability workshops, and green initiatives.",
    category: "Environment",
    members: 203,
    logoUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop&crop=center",
    isJoined: false
  },
  {
    id: 4,
    name: "Basketball Team",
    description: "Competitive basketball team seeking passionate players. Train hard, play harder, and represent our school with pride.",
    category: "Sports",
    members: 32,
    logoUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=100&h=100&fit=crop&crop=center",
    isJoined: true
  },
  {
    id: 5,
    name: "Music Ensemble",
    description: "Create beautiful music together through various instruments and vocal performances. All skill levels welcome to join our harmony.",
    category: "Arts",
    members: 67,
    logoUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop&crop=center",
    isJoined: false
  },
  {
    id: 6,
    name: "Debate Society",
    description: "Sharpen your argumentation skills and engage in intellectual discourse on current topics and social issues.",
    category: "Academic",
    members: 78,
    logoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=center",
    isJoined: false
  },
  {
    id: 7,
    name: "Robotics Team",
    description: "Build and program robots for competitions. Combine engineering, programming, and creativity to solve complex challenges.",
    category: "Technology",
    members: 54,
    logoUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop&crop=center",
    isJoined: true
  },
  {
    id: 8,
    name: "Photography Club",
    description: "Capture moments and tell stories through the lens. Learn techniques, share work, and explore different photography styles.",
    category: "Arts",
    members: 123,
    logoUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=100&fit=crop&crop=center",
    isJoined: false
  },
  {
    id: 9,
    name: "Volunteer Service",
    description: "Give back to the community through various service projects and charitable initiatives that make a real impact.",
    category: "Service",
    members: 167,
    logoUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop&crop=center",
    isJoined: false
  },
  {
    id: 10,
    name: "Chess Club",
    description: "Strategic thinking and competitive chess play. From beginners to masters, everyone can improve their game here.",
    category: "Academic",
    members: 43,
    logoUrl: "https://images.unsplash.com/photo-1528819622765-d6bcf132858a?w=100&h=100&fit=crop&crop=center",
    isJoined: true
  },
  {
    id: 11,
    name: "Hiking Society",
    description: "Explore nature trails and mountain peaks together. Build endurance, enjoy fresh air, and discover beautiful landscapes.",
    category: "Sports",
    members: 91,
    logoUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=100&h=100&fit=crop&crop=center",
    isJoined: false
  },
  {
    id: 12,
    name: "Culinary Arts",
    description: "Discover the joy of cooking and baking. Learn recipes, techniques, and food presentation from around the world.",
    category: "Lifestyle",
    members: 76,
    logoUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop&crop=center",
    isJoined: false
  },
  {
    id: 13,
    name: "Science Olympiad",
    description: "Compete in various science disciplines and represent our school in regional and national competitions.",
    category: "Academic",
    members: 38,
    logoUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=100&h=100&fit=crop&crop=center",
    isJoined: false
  },
  {
    id: 14,
    name: "Gaming League",
    description: "Competitive gaming across multiple platforms and titles. Join tournaments, improve skills, and connect with fellow gamers.",
    category: "Technology",
    members: 189,
    logoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center",
    isJoined: true
  }
];

const CATEGORIES = ["Technology", "Arts", "Sports", "Academic", "Environment", "Service", "Lifestyle"];
const SORT_OPTIONS = [
  { value: "name", label: "Name A-Z" },
  { value: "members-desc", label: "Most Members" },
  { value: "members-asc", label: "Least Members" },
  { value: "category", label: "Category" }
];

// Loading Skeleton Component
function ClubCardSkeleton({ className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-pulse ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-9 bg-gray-200 rounded-lg flex-1"></div>
        <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
      </div>
    </div>
  );
}

// Club Card Component
function ClubCard({ club, onJoinToggle, className = "" }) {
  const handleJoinToggle = (e) => {
    e.stopPropagation();
    onJoinToggle(club.id);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    // Navigate to /clubs/:id - in real app, use router
    window.location.href = `/clubs/${club.id}`;
  };

  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${className}`}
      role="article"
      aria-labelledby={`club-${club.id}-name`}
    >
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={club.logoUrl} 
          alt={`${club.name} logo`}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1 min-w-0">
          <h3 
            id={`club-${club.id}-name`}
            className="font-semibold text-lg text-gray-900 truncate"
          >
            {club.name}
          </h3>
          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {club.category}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {club.description}
      </p>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          {club.members} members
        </span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleJoinToggle}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 ${
            club.isJoined
              ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500'
          }`}
          aria-label={club.isJoined ? `Leave ${club.name}` : `Join ${club.name}`}
        >
          {club.isJoined ? 'Leave' : 'Join'}
        </button>
        <button
          onClick={handleViewDetails}
          className="px-4 py-2 rounded-lg font-medium text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          aria-label={`View details for ${club.name}`}
        >
          Details
        </button>
      </div>
    </div>
  );
}

// Filters Component
function Filters({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategories, 
  setSelectedCategories,
  minMembers,
  setMinMembers,
  maxMembers,
  setMaxMembers,
  sortBy,
  setSortBy,
  onReset,
  className = ""
}) {
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setSearchQuery]);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 shadow-sm ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
      
      {/* Search Input */}
      <div className="mb-4">
        <label htmlFor="search-clubs" className="block text-sm font-medium text-gray-700 mb-2">
          Search Clubs
        </label>
        <input
          id="search-clubs"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or description..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          aria-label="Search clubs"
        />
      </div>

      {/* Category Chips */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 ${
                selectedCategories.includes(category)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={`${selectedCategories.includes(category) ? 'Remove' : 'Add'} ${category} filter`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
{/* Member Count Range */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Member Count
  </label>
  <div className="flex gap-2">
    <input
      type="number"
      value={minMembers}
      onChange={(e) => setMinMembers(e.target.value)}
      placeholder="Min"
      min="0"
      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      aria-label="Minimum member count"
    />
    <span className="text-gray-500 flex items-center">–</span>
    <input
      type="number"
      value={maxMembers}
      onChange={(e) => setMaxMembers(e.target.value)}
      placeholder="Max"
      min="0"
      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      aria-label="Maximum member count"
    />
  </div>
</div>


      {/* Sort Select */}
      <div className="mb-4">
        <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          aria-label="Sort clubs by"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors duration-200"
      >
        Reset Filters
      </button>
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange, className = "" }) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 ${
          canGoPrevious
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Previous page"
      >
        Previous
      </button>
      
      <span className="text-sm text-gray-600" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 ${
          canGoNext
            ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}

// Main Clubs Page Component
export default function ClubsPage({ className = "" }) {
  const [clubs, setClubs] = useState(DUMMY_CLUBS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minMembers, setMinMembers] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 9;

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort clubs
  const filteredAndSortedClubs = useMemo(() => {
    let filtered = clubs.filter(club => {
      const matchesSearch = searchQuery === '' || 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(club.category);
      
      const matchesMinMembers = minMembers === '' || 
        club.members >= parseInt(minMembers);
      
      const matchesMaxMembers = maxMembers === '' || 
        club.members <= parseInt(maxMembers);
      
      return matchesSearch && matchesCategory && matchesMinMembers && matchesMaxMembers;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members-desc':
          return b.members - a.members;
        case 'members-asc':
          return a.members - b.members;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [clubs, searchQuery, selectedCategories, minMembers, maxMembers, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedClubs.length / ITEMS_PER_PAGE);
  const paginatedClubs = filteredAndSortedClubs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, minMembers, maxMembers, sortBy]);

  const handleJoinToggle = (clubId) => {
    setClubs(prev =>
      prev.map(club =>
        club.id === clubId
          ? { ...club, isJoined: !club.isJoined }
          : club
      )
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMinMembers('');
    setMaxMembers('');
    setSortBy('name');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className={`max-w-7xl mx-auto px-4 py-8 ${className}`}>
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4 w-20"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ClubCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clubs</h1>
        <p className="text-gray-600">
          {filteredAndSortedClubs.length} of {clubs.length} clubs
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Filters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            minMembers={minMembers}
            setMinMembers={setMinMembers}
            maxMembers={maxMembers}
            setMaxMembers={setMaxMembers}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onReset={handleResetFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {filteredAndSortedClubs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters to find more clubs.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Clubs Grid */}
              <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 mb-8">
                {paginatedClubs.map(club => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    onJoinToggle={handleJoinToggle}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}