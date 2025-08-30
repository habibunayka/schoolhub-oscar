import React, { useState, useEffect, useMemo } from 'react';
import { listClubs, joinClub, leaveClub } from "@services/clubs.js";
import { listCategories } from "@services/clubCategories.js";
import { getAssetUrl } from "@utils";
import SafeImage from '@/components/SafeImage';
import { toast } from 'sonner';
import useConfirm from "@hooks/useConfirm.js";

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
    if (!club.isRequested) {
      onJoinToggle(club.id);
    }
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
        <SafeImage 
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
          disabled={club.isRequested}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 ${
            club.isJoined
              ? 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
              : club.isRequested
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500'
          }`}
          aria-label={
            club.isJoined
              ? `Leave ${club.name}`
              : club.isRequested
                ? `Request pending for ${club.name}`
                : `Join ${club.name}`
          }
        >
          {club.isJoined ? 'Leave' : club.isRequested ? 'Requested' : 'Join'}
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
  availableCategories,
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
          {availableCategories.map(category => (
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
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minMembers, setMinMembers] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    async function fetchClubs() {
      try {
        const data = await listClubs();
        const mapped = data.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description || "",
          category: c.category_name || "General",
          members: Number(c.member_count) || 0,
          logoUrl: getAssetUrl(c.logo_url) || "",
          isJoined: c.membership_status === 'approved',
          isRequested: c.membership_status === 'pending',
        }));
        setClubs(mapped);
      } finally {
        setLoading(false);
      }
    }
    async function fetchCategories() {
      const data = await listCategories({ withClubs: true });
      setCategories(data.map(c => c.name));
    }
    fetchClubs();
    fetchCategories();
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

  const handleJoinToggle = async (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    if (!club) return;
    try {
      if (club.isJoined) {
        if (!(await confirm(`Leave ${club.name}?`))) return;
        await leaveClub(clubId);
        setClubs(prev =>
          prev.map(c =>
            c.id === clubId
              ? { ...c, isJoined: false, members: c.members - 1 }
              : c
          )
        );
        toast.success(`Left ${club.name}`);
      } else if (club.isRequested) {
        toast.info('Join request pending');
      } else {
        if (!(await confirm(`Request to join ${club.name}?`))) return;
        await joinClub(clubId);
        setClubs(prev =>
          prev.map(c =>
            c.id === clubId
              ? { ...c, isRequested: true }
              : c
          )
        );
        toast.success('Join request sent');
      }
    } catch (e) {
      console.error(e);
      toast.error('Action failed');
    }
  };

  const { confirm, ConfirmDialog } = useConfirm();

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
      <>
      <ConfirmDialog />
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
      </>
    );
  }

  return (
    <>
    <ConfirmDialog />
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
            availableCategories={categories}
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
    </>
  );
}