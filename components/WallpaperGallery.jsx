"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { animate, stagger } from 'animejs';
import { Download, ExternalLink, Search, RefreshCw, ImageIcon } from 'lucide-react';

const CATEGORIES = [
    { label: 'Minimal', query: 'minimalism' },
    { label: 'Nature', query: 'nature landscape' },
    { label: 'Space', query: 'space galaxy' },
    { label: 'Abstract', query: 'abstract art' },
    { label: 'Dark', query: 'dark aesthetic' },
    { label: 'Anime', query: 'anime scenery' },
];

const SkeletonCard = () => (
    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5 aspect-video animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon size={32} className="text-slate-700" />
        </div>
    </div>
);

const WallpaperGallery = () => {
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('minimalism');
    const [error, setError] = useState(null);

    const fetchWallpapers = async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/wallpapers?q=${encodeURIComponent(query)}`);
            const data = response.data?.data || [];
            setWallpapers(data);

            setTimeout(() => {
                animate('.wp-card', {
                    translateY: [30, 0],
                    opacity: [0, 1],
                    scale: [0.95, 1],
                    delay: stagger(60),
                    ease: 'outExpo',
                    duration: 600,
                });
            }, 50);
        } catch (err) {
            console.error('Wallpaper fetch error:', err);
            setError('Could not load wallpapers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallpapers(activeCategory);
    }, [activeCategory]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && search.trim()) {
            fetchWallpapers(search.trim());
        }
    };

    const handleCategoryClick = (q) => {
        setActiveCategory(q);
        setSearch('');
    };

    return (
        <div className="w-full space-y-8">

            {/* ── Header row ── */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* Title */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-1">Live Gallery</p>
                    <h2 className="text-3xl font-bold text-white leading-tight">
                        Discover <span className="grad-text">Wallpapers</span>
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Click a card to preview · Download in full resolution</p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search anything…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full rounded-xl bg-slate-900 border border-white/8 text-sm text-slate-200 placeholder:text-slate-600 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all"
                    />
                </div>
            </div>

            {/* ── Category Pills ── */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(({ label, query }) => (
                    <button
                        key={query}
                        onClick={() => handleCategoryClick(query)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${activeCategory === query
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-slate-900 border-white/8 text-slate-400 hover:border-white/20 hover:text-white'
                            }`}
                    >
                        {label}
                    </button>
                ))}

                {/* Refresh */}
                <button
                    onClick={() => fetchWallpapers(activeCategory)}
                    className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900 border border-white/8 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                    <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="rounded-xl bg-red-950/40 border border-red-800/40 text-red-400 text-sm px-4 py-3">
                    {error}
                </div>
            )}

            {/* ── Grid ── */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : wallpapers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-600 gap-3">
                    <ImageIcon size={48} />
                    <p className="text-sm">No wallpapers found. Try a different search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wallpapers.map((wall) => (
                        <div
                            key={wall.id}
                            className="wp-card card-lift group relative rounded-2xl overflow-hidden border border-white/5 aspect-video bg-slate-900 opacity-0"
                        >
                            <img
                                src={wall.thumbs?.large}
                                alt={wall.id}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                                    {/* Resolution tag */}
                                    <span className="text-[10px] font-bold tracking-wider text-slate-300 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                                        {wall.resolution}
                                    </span>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => window.open(wall.path, '_blank')}
                                            title="Download"
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-lg"
                                        >
                                            <Download size={12} />
                                            Save
                                        </button>
                                        <button
                                            onClick={() => window.open(wall.url, '_blank')}
                                            title="View on Wallhaven"
                                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Footer count ── */}
            {!loading && wallpapers.length > 0 && (
                <p className="text-center text-xs text-slate-600">
                    Showing {wallpapers.length} wallpapers · Powered by Wallhaven
                </p>
            )}
        </div>
    );
};

export default WallpaperGallery;
