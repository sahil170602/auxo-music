import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Heart, 
  MessageCircle, 
  Share2, 
  ListMusic,
  Search,
  User,
  Disc,
  Zap,
  Home as HomeIcon,
  Music,
  Sun,
  Moon,
  X,
  Clock,
  Plus,
  Mic2,
  Library,
  ChevronDown,
  ArrowLeft,
  Settings,
  Shield,
  HelpCircle,
  FileText,
  ChevronRight,
  LogOut,
  Bell,
  Smartphone,
  Wifi,
  Edit2,
  Check,
  ChevronUp,
  Shuffle,
  Repeat
} from 'lucide-react';

// --- IMPORT DATABASE ---
// This pulls the song list from your separate database.js file
import { songs as dbSongs } from './database';

// --- Components ---

const ProgressBar = ({ isPlaying }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full h-1 bg-white/20 rounded-full mt-4 overflow-hidden group cursor-pointer">
      <div 
        className="h-full bg-white transition-all duration-100 ease-linear relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg" />
      </div>
      <div className="flex justify-between text-[10px] text-white/60 mt-1 font-medium">
        <span>{Math.floor((progress / 100) * 180 / 60)}:{String(Math.floor(((progress / 100) * 180) % 60)).padStart(2, '0')}</span>
        <span>3:00</span>
      </div>
    </div>
  );
};

const Navbar = ({ activeTab, setActiveTab, isDarkMode }) => (
  <div className={`fixed bottom-0 left-0 w-full backdrop-blur-xl border-t px-6 py-4 flex justify-between items-center z-50 md:max-w-md md:left-1/2 md:-translate-x-1/2 md:rounded-b-3xl shadow-2xl transition-colors duration-500
    ${isDarkMode 
      ? 'bg-black/40 border-white/10' 
      : 'bg-white/80 border-gray-200/50'
    }`}
  >
     {[
       { id: 'home', icon: HomeIcon, label: 'Home' },
       { id: 'discover', icon: Disc, label: 'Library' },
       { id: 'search', icon: Search, label: 'Search' },
       { id: 'me', icon: User, label: 'Me' }
     ].map(item => (
        <button 
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 min-w-[50px] ${activeTab === item.id 
            ? (isDarkMode ? 'text-white scale-110' : 'text-purple-600 scale-110') 
            : (isDarkMode ? 'text-white/40 hover:text-white/70' : 'text-gray-400 hover:text-gray-600')}`}
        >
          <item.icon size={22} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
     ))}
  </div>
);

const LyricsView = ({ lyrics, isPlaying }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isPlaying && lyrics) {
      const interval = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % lyrics.length);
      }, 3000); 
      return () => clearInterval(interval);
    }
  }, [isPlaying, lyrics]);

  if (!lyrics || lyrics.length === 0) return <div className="h-64 flex items-center justify-center text-white/40">No Lyrics Available</div>;

  return (
    <div className="h-64 overflow-hidden flex flex-col items-center justify-center mask-image-linear-gradient">
      <div className="flex flex-col gap-4 text-center transition-all duration-500" style={{ transform: `translateY(-${activeIndex * 30}px)` }}>
        {lyrics.map((line, idx) => (
          <p 
            key={idx} 
            className={`text-xl font-bold transition-all duration-500 px-4 leading-relaxed drop-shadow-md
              ${idx === activeIndex 
                ? 'text-white scale-105 opacity-100 blur-none' 
                : 'text-white/40 scale-95 opacity-50 blur-[1px]'
              }`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
};

const SongFeedItem = ({ 
    song, 
    isActive, 
    onPlayToggle, 
    isPlaying, 
    onNext, 
    onPrev, 
    onClose,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat
}) => {
  const [liked, setLiked] = useState(false);

  if (!song) return null;

  return (
    <div className={`fixed inset-0 w-full h-full bg-gradient-to-br ${song.color || 'from-gray-900 to-black'} to-black flex flex-col z-[60] transition-transform duration-500 ease-in-out
        ${isActive ? 'translate-y-0' : 'translate-y-full'}`}>
      {/* Top Bar */}
      <div className="w-full p-6 pt-8 flex justify-between items-center text-white z-10">
        <button onClick={onClose} className="p-2 rounded-full bg-black/20 backdrop-blur-md active:scale-95 transition-transform">
            <ChevronDown size={28} />
        </button>
        <div className="flex gap-2 text-lg font-bold items-center drop-shadow-lg">
          <span className="text-white tracking-wide">Now Playing</span>
        </div>
        <ListMusic className="text-white drop-shadow-md" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center relative overflow-hidden">
        <img 
          src={song.cover} 
          alt="bg" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-125 saturate-150"
        />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

        <div className="relative z-10 flex flex-col items-center w-full px-6 gap-8">
          <div className="w-72 h-72 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden relative group border border-white/10">
            <img 
              src={song.cover} 
              alt={song.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`} 
            />
          </div>
          <LyricsView lyrics={song.lyrics} isPlaying={isPlaying} />
        </div>
      </div>

      {/* Bottom Panel - Glass Effect */}
      <div className="w-full p-8 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
        
        {/* Social Actions */}
        <div className="flex justify-between items-center mb-6 px-2">
            <div className="flex gap-4">
                <button onClick={() => setLiked(!liked)} className="transition-transform active:scale-90">
                    <Heart size={28} className={`transition-colors drop-shadow-md ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
                <button className="transition-transform active:scale-90">
                    <MessageCircle size={28} className="text-white drop-shadow-md" />
                </button>
                <button className="transition-transform active:scale-90">
                    <Share2 size={28} className="text-white drop-shadow-md" />
                </button>
            </div>
        </div>

        {/* Song Info */}
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md truncate">{song.title}</h2>
            <p className="text-white/80 text-lg font-medium drop-shadow-sm truncate">{song.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
                 <button 
                    onClick={toggleShuffle} 
                    className={`transition-colors ${isShuffle ? 'text-green-400' : 'text-white/70 hover:text-white'}`}
                 >
                    <Shuffle size={24} />
                 </button>

                 <button onClick={onPrev} className="text-white/70 hover:text-white transition-colors hover:scale-110 active:scale-95">
                    <SkipBack size={32} className="drop-shadow-sm" />
                 </button>

                 <button 
                    onClick={onPlayToggle}
                    className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-md text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                >
                    {isPlaying ? <Pause size={36} fill="black" /> : <Play size={36} fill="black" className="ml-1" />}
                </button>

                 <button onClick={onNext} className="text-white/70 hover:text-white transition-colors hover:scale-110 active:scale-95">
                    <SkipForward size={32} className="drop-shadow-sm" />
                 </button>

                 <button 
                    onClick={toggleRepeat} 
                    className={`transition-colors relative ${repeatMode !== 0 ? 'text-green-400' : 'text-white/70 hover:text-white'}`}
                 >
                    <Repeat size={24} />
                    {repeatMode === 2 && (
                        <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-green-400 text-black w-3 h-3 flex items-center justify-center rounded-full">1</span>
                    )}
                 </button>
            </div>
            
            <ProgressBar isPlaying={isPlaying} />
        </div>
      </div>
    </div>
  );
};

const FloatingPlayer = ({ song, isPlaying, onPlayToggle, onExpand, isDarkMode }) => {
    if (!song) return null;

    return (
        <div 
            onClick={onExpand}
            className={`fixed bottom-24 left-4 right-4 p-2 rounded-2xl backdrop-blur-xl border shadow-2xl z-40 flex items-center gap-3 transition-all duration-300 cursor-pointer active:scale-[0.98]
            ${isDarkMode ? 'bg-black/60 border-white/10' : 'bg-white/80 border-white/50'}`}>
            
            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 relative flex-shrink-0
                ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <img 
                    src={song.cover} 
                    alt={song.title} 
                    className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`} 
                    style={{ animationDuration: '8s' }}
                />
                <div className="absolute inset-0 bg-black/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black/50 rounded-full backdrop-blur-sm border border-white/20" />
            </div>

            <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{song.title}</h4>
                <p className={`text-xs truncate ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{song.artist}</p>
            </div>

            <div className="flex items-center gap-2 pr-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); onPlayToggle(); }}
                    className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-95
                        ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>
            </div>
        </div>
    );
};

const SeeAllView = ({ title, songs, onBack, onPlay, isDarkMode }) => (
    <div className="pb-40 pt-8 min-h-screen bg-transparent overflow-y-auto no-scrollbar animate-fade-in">
        <div className="flex items-center gap-4 px-4 mb-6">
            <button onClick={onBack} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <ArrowLeft size={24} />
            </button>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
        </div>
        <div className="px-4 grid grid-cols-2 gap-4">
            {songs.map((song) => (
                <div key={song.id} onClick={() => onPlay(song)} className={`p-2 rounded-xl transition-all cursor-pointer ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100/50'}`}>
                    <div className="relative mb-3 aspect-square">
                        <img src={song.cover} className="w-full h-full object-cover rounded-xl shadow-lg" alt={song.title} loading="lazy" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl"><div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><Play size={20} fill="black" className="ml-1" /></div></div>
                    </div>
                    <h4 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{song.title}</h4>
                    <p className={`text-xs truncate ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{song.artist}</p>
                </div>
            ))}
        </div>
    </div>
);

const SongSection = ({ title, songs, onPlay, isDarkMode, onSeeAll }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className={`font-bold text-lg drop-shadow-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
        <button 
            onClick={() => onSeeAll(title, songs)}
            className={`text-xs font-medium backdrop-blur-sm px-2 py-1 rounded-full border transition-colors cursor-pointer
            ${isDarkMode 
                ? 'text-white/60 bg-white/5 border-white/5 hover:bg-white/10' 
                : 'text-gray-500 bg-white/40 border-gray-200 hover:bg-white/60'}`}>
            See all
        </button>
      </div>
      <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {songs.map(song => (
              <div key={song.id} onClick={() => onPlay(song)} className={`min-w-[140px] cursor-pointer group snap-start p-2 rounded-2xl transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-white/40'}`}>
                  <div className="relative mb-3">
                    <img src={song.cover} className={`w-36 h-36 object-cover rounded-xl shadow-lg group-active:scale-95 transition-transform border ${isDarkMode ? 'border-white/5' : 'border-gray-200/50'}`} alt={song.title} loading="lazy" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[2px]"><div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><Play size={20} fill="black" className="ml-1" /></div></div>
                  </div>
                  <p className={`text-sm font-medium truncate w-36 drop-shadow-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{song.title}</p>
                  <p className={`text-xs truncate w-36 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{song.artist}</p>
              </div>
          ))}
      </div>
    </div>
);

const Home = ({ onPlaySong, isDarkMode, songs }) => {
    const [expandedSection, setExpandedSection] = useState(null);

    const recentlyPlayed = useMemo(() => songs.slice(0, 10), [songs]);
    const bollywood = useMemo(() => songs.filter(s => s.category === 'bollywood' || s.category === 'imported').slice(0, 10), [songs]);
    const hollywood = useMemo(() => songs.filter(s => s.category === 'hollywood').slice(0, 10), [songs]);
    const trending = useMemo(() => songs.slice(0, 10), [songs]);

    if (expandedSection) {
        return <SeeAllView title={expandedSection.title} songs={expandedSection.songs} onBack={() => setExpandedSection(null)} onPlay={onPlaySong} isDarkMode={isDarkMode} />;
    }
  
    return (
        <div className="pb-40 pt-8 min-h-screen bg-transparent overflow-y-auto no-scrollbar">
            <div className="px-4 mb-8 flex justify-between items-center">
                <div><h1 className={`text-3xl font-bold mb-1 drop-shadow-sm ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60' : 'text-gray-900'}`}>Good Evening</h1><p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>Welcome back to Auxo</p></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500/80 to-blue-600/80 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"><User size={24} className="text-white" /></div>
            </div>
            <div className="px-4 mb-8">
                <div className={`w-full h-44 rounded-3xl backdrop-blur-md border p-6 flex flex-col justify-center relative overflow-hidden shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-r from-pink-600/80 to-purple-700/80 border-white/10' : 'bg-gradient-to-r from-pink-400/90 to-purple-500/90 border-white/40 shadow-purple-200'}`}>
                    <div className="relative z-10"><span className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase mb-2 inline-block shadow-sm">New Release</span><h2 className="text-3xl font-bold text-white mb-1 drop-shadow-md">Weekly Mix</h2><p className="text-white/90 text-sm font-medium">Curated just for you</p></div>
                    <Music size={140} className="absolute -right-6 -bottom-6 text-white/10 rotate-12" />
                </div>
            </div>
            <SongSection title="Recently Played" songs={recentlyPlayed} onPlay={onPlaySong} isDarkMode={isDarkMode} onSeeAll={(t, s) => setExpandedSection({title: t, songs: s})} />
            <SongSection title="Trending Now" songs={trending} onPlay={onPlaySong} isDarkMode={isDarkMode} onSeeAll={(t, s) => setExpandedSection({title: t, songs: s})} />
            <SongSection title="Bollywood Hits" songs={bollywood} onPlay={onPlaySong} isDarkMode={isDarkMode} onSeeAll={(t, s) => setExpandedSection({title: t, songs: s})} />
            <SongSection title="Hollywood Essentials" songs={hollywood} onPlay={onPlaySong} isDarkMode={isDarkMode} onSeeAll={(t, s) => setExpandedSection({title: t, songs: s})} />
        </div>
    );
};

const SearchPage = ({ songs, onPlay, isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches] = useState(['Lo-Fi Beats', 'Arijit Singh', 'Rock Classics', 'Workout Mix']); 

  const filteredSongs = useMemo(() => {
      if (!query) return [];
      const lowerQuery = query.toLowerCase();
      return songs.filter(s => 
          s.title.toLowerCase().includes(lowerQuery) || 
          s.artist.toLowerCase().includes(lowerQuery)
      ).slice(0, 50); 
  }, [query, songs]);

  return (
    <div className="pt-24 px-6 pb-40 min-h-screen overflow-y-auto no-scrollbar">
      <div className={`transition-all duration-500 transform ${isFocused ? '-translate-y-4 opacity-0 h-0' : 'translate-y-0 opacity-100 h-auto mb-6'}`}>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60' : 'text-gray-900'}`}>Search</h1>
      </div>
      <div className="relative z-20 group">
        <div className={`absolute inset-0 rounded-2xl blur-lg opacity-40 transition-all duration-500 ${isFocused ? (isDarkMode ? 'bg-purple-500/50' : 'bg-purple-300/60') : 'bg-transparent'}`} />
        <div className={`relative flex items-center p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-white/10 border-white/10 focus-within:bg-white/15' : 'bg-white/70 border-white/60 focus-within:bg-white/90'}`}>
          <Search className={`w-6 h-6 mr-3 transition-colors ${isFocused ? 'text-purple-500' : (isDarkMode ? 'text-white/50' : 'text-gray-400')}`} />
          <input type="text" placeholder="Songs, Artists, or Albums..." className={`w-full bg-transparent outline-none text-lg font-medium placeholder:font-normal transition-colors ${isDarkMode ? 'text-white placeholder:text-white/30' : 'text-gray-900 placeholder:text-gray-400'}`} value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => !query && setIsFocused(false)} />
          {query && (<button onClick={() => { setQuery(''); setIsFocused(false); }}><X className={`w-5 h-5 ${isDarkMode ? 'text-white/50' : 'text-gray-400'}`} /></button>)}
        </div>
      </div>
      <div className={`mt-8 transition-all duration-500 ${isFocused ? 'opacity-100 translate-y-0' : 'opacity-100'}`}>
        <div className="space-y-3 pb-24">
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-white/40' : 'text-gray-400'}`}>{query ? 'Top Results' : ''}</h3>
          {filteredSongs.map((song) => (
             <div key={song.id} onClick={() => onPlay(song)} className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${isDarkMode ? 'hover:bg-white/10 border-transparent hover:border-white/5' : 'hover:bg-white/60 border-transparent hover:border-white/50'}`}>
                <img src={song.cover} alt={song.title} className="w-14 h-14 rounded-xl object-cover shadow-md" loading="lazy" />
                <div className="flex-1 min-w-0"><h4 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{song.title}</h4><p className={`text-sm truncate ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{song.artist}</p></div>
                <button className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}><Play size={16} fill="currentColor" /></button>
             </div>
          ))}
          {query && filteredSongs.length === 0 && <p className={`text-center text-sm opacity-50 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>No songs found matching "{query}"</p>}
        </div>
      </div>
    </div>
  )
}

const LibraryPage = ({ isDarkMode, onPlaySong, songs }) => {
    const [view, setView] = useState('main'); 
    const [playlists, setPlaylists] = useState([
        { name: "Road Trip 2024", count: "42 Songs", cover: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60" },
        { name: "Gym Hype", count: "18 Songs", cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60" }
    ]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [displayLimit, setDisplayLimit] = useState(20);

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            setPlaylists([{ name: newPlaylistName, count: "0 Songs", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=60" }, ...playlists]);
            setNewPlaylistName("");
            setShowCreateModal(false);
        }
    };

    const filteredPlaylists = playlists.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const renderDetailView = () => {
        let title = "";
        let items = [];

        if (view === 'liked') { 
            title = "Liked Songs"; 
            items = songs.slice(0, displayLimit); 
        } 
        else if (view === 'artists') {
            title = "Artists";
            const uniqueArtists = [...new Set(songs.map(s => s.artist))];
            items = uniqueArtists.slice(0, displayLimit).map((artist, i) => ({ 
                id: i, 
                title: artist, 
                artist: `${songs.filter(s => s.artist === artist).length} tracks`, 
                cover: songs.find(s => s.artist === artist)?.cover 
            }));
        } 
        else if (view === 'albums') { 
            title = "Albums"; 
            items = songs.slice(0, displayLimit).map(s => ({ ...s, artist: s.artist })); 
        } 
        else if (view === 'local') { 
            title = "Local Files"; 
            items = songs.slice(0, 5).map(s => ({ ...s, title: `${s.title} (Local)` })); 
        }

        return (
            <div className="pt-8 px-6 pb-40 min-h-screen animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => { setView('main'); setDisplayLimit(20); }} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}><ArrowLeft size={24} /></button>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
                </div>
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} onClick={() => (view === 'liked' || view === 'local') ? onPlaySong(item) : null} className={`flex items-center gap-4 p-2 rounded-xl transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100/50'}`}>
                            <img src={item.cover} alt={item.title} className="w-14 h-14 rounded-lg object-cover shadow-md" loading="lazy" />
                            <div className="flex-1"><h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4><p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>{item.artist}</p></div>
                            {(view === 'liked' || view === 'local') && <button className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}><Play size={16} fill="currentColor" /></button>}
                        </div>
                    ))}
                </div>
                {songs.length > displayLimit && view !== 'local' && (
                    <button 
                        onClick={() => setDisplayLimit(prev => prev + 20)}
                        className={`w-full py-4 mt-6 rounded-2xl font-bold transition-all ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-200 text-gray-900 hover:bg-gray-300'}`}
                    >
                        Load More
                    </button>
                )}
            </div>
        );
    };

    if (view !== 'main') return renderDetailView();

    return (
        <div className="pt-8 px-6 pb-40 min-h-screen overflow-y-auto no-scrollbar animate-fade-in relative">
            <div className="flex justify-between items-center mb-8 h-10">
                {isSearchActive ? (
                    <div className={`flex-1 flex items-center p-2 rounded-xl border transition-all ${isDarkMode ? 'bg-white/10 border-white/20' : 'bg-gray-100 border-gray-300'}`}>
                        <Search size={18} className={isDarkMode ? 'text-white/50' : 'text-gray-500'} />
                        <input autoFocus type="text" placeholder="Search playlists..." className={`flex-1 bg-transparent border-none outline-none ml-2 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        <button onClick={() => { setIsSearchActive(false); setSearchQuery(""); }}><X size={18} className={isDarkMode ? 'text-white/50' : 'text-gray-500'} /></button>
                    </div>
                ) : (
                    <>
                        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Library</h1>
                        <button onClick={() => setIsSearchActive(true)} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}><Search size={20} /></button>
                    </>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-8">
                {[{id: 'liked', icon: Heart, label: 'Liked', col: 'text-pink-500'}, {id: 'artists', icon: Mic2, label: 'Artists', col: 'text-purple-500'}, {id: 'albums', icon: Disc, label: 'Albums', col: 'text-blue-500'}, {id: 'local', icon: ListMusic, label: 'Local', col: 'text-green-500'}].map(item => (
                    <div key={item.id} onClick={() => setView(item.id)} className={`p-4 rounded-2xl border backdrop-blur-md transition-all cursor-pointer hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/60 border-gray-200 hover:bg-white/80'}`}>
                        <item.icon className={`mb-3 ${item.col}`} fill={item.id === 'liked' ? 'currentColor' : 'none'} />
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</h4>
                    </div>
                ))}
            </div>
            <button onClick={() => setShowCreateModal(true)} className={`w-full py-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 mb-8 transition-colors ${isDarkMode ? 'border-white/20 text-white/60 hover:text-white' : 'border-gray-300 text-gray-500 hover:text-gray-800'}`}>
                <Plus size={20} /><span className="font-medium">Create New Playlist</span>
            </button>
            <div className="space-y-3">
                {filteredPlaylists.map((playlist, idx) => (
                    <div key={idx} className={`flex items-center gap-4 p-2 rounded-xl cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100/50'}`}>
                        <img src={playlist.cover} alt={playlist.name} className="w-16 h-16 rounded-lg object-cover shadow-md" />
                        <div className="flex-1"><h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{playlist.name}</h4><p className={`text-xs ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>{playlist.count}</p></div>
                    </div>
                ))}
            </div>
            {showCreateModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
                    <div className={`relative w-full max-w-xs p-6 rounded-3xl border shadow-2xl animate-fade-in ${isDarkMode ? 'bg-gray-900/90 border-white/10' : 'bg-white/90 border-white'}`}>
                        <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>New Playlist</h3>
                        <input autoFocus type="text" placeholder="Playlist Name" className={`w-full p-3 rounded-xl mb-4 outline-none border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-100 border-gray-200'}`} value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()} />
                        <div className="flex gap-3"><button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl font-medium">Cancel</button><button onClick={handleCreatePlaylist} className="flex-1 py-3 rounded-xl font-medium bg-purple-600 text-white">Create</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MePage = ({ isDarkMode, setIsDarkMode }) => {
    const [view, setView] = useState('main'); 
    const [userProfile, setUserProfile] = useState({ username: "Guest User", email: "guest@vudia.com", region: "India" });
    const [appSettings, setAppSettings] = useState({ quality: "High", dataSaver: false, notifications: true });

    const Header = ({ title }) => (
        <div className="flex items-center gap-4 mb-6"><button onClick={() => setView('main')} className={`p-2 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}><ArrowLeft size={24} /></button><h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h1></div>
    );

    const MenuItem = ({ icon: Icon, title, onClick, destructive }) => (
        <button onClick={onClick} className={`w-full flex items-center justify-between p-4 rounded-2xl mb-3 border backdrop-blur-md transition-all active:scale-[0.98] ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-white/60 border-gray-200 hover:bg-white/80 text-gray-900'} ${destructive ? 'text-red-500' : ''}`}>
            <div className="flex items-center gap-4"><div className={`p-2 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'} ${destructive ? 'bg-red-500/10' : ''}`}><Icon size={20} className={destructive ? 'text-red-500' : (isDarkMode ? 'text-white' : 'text-gray-600')} /></div><span className="font-medium">{title}</span></div>{!destructive && <ChevronRight size={18} className={isDarkMode ? 'text-white/30' : 'text-gray-400'} />}
        </button>
    );

    const AccountView = () => {
        const [isEditing, setIsEditing] = useState(false);
        const [tempProfile, setTempProfile] = useState(userProfile);
        return (
            <div className="pt-8 px-6 pb-40 min-h-screen animate-fade-in">
                <Header title="Account Information" />
                <div className="flex flex-col items-center mb-8 relative">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-xl border-4 ${isDarkMode ? 'bg-gray-800 border-white/10' : 'bg-gray-200 border-white'}`}><User size={40} className={isDarkMode ? 'text-white/50' : 'text-gray-500'} /></div>
                    <button onClick={() => { if(isEditing) setUserProfile(tempProfile); setIsEditing(!isEditing); }} className={`absolute top-0 right-0 p-2 rounded-full shadow-lg ${isEditing ? 'bg-green-500 text-white' : (isDarkMode ? 'bg-white/10 text-white' : 'bg-white text-gray-900')}`}>{isEditing ? <Check size={16} /> : <Edit2 size={16} />}</button>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile.username}</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>ID: 884-291-AUX</p>
                </div>
                <div className={`p-4 rounded-2xl border mb-6 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="space-y-4">
                        {['username', 'email', 'region'].map(field => (
                            <div key={field} className="flex flex-col gap-1 py-2 border-b border-white/10">
                                <span className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-gray-400'} uppercase`}>{field}</span>
                                {isEditing ? <input className={`bg-transparent outline-none border-b border-purple-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} value={tempProfile[field]} onChange={(e) => setTempProfile({...tempProfile, [field]: e.target.value})} /> : <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userProfile[field]}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const SettingsView = () => (
        <div className="pt-8 px-6 pb-40 min-h-screen animate-fade-in">
            <Header title="Settings & Privacy" />
            <div className="space-y-6">
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                    <div onClick={() => setAppSettings(p => ({...p, quality: p.quality === "High" ? "Low" : p.quality === "Low" ? "Medium" : "High"}))} className="flex items-center justify-between mb-4 cursor-pointer">
                        <div className="flex items-center gap-3"><Wifi size={20} /><span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Stream Quality</span></div><span className={`text-xs px-2 py-1 rounded-md ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>{appSettings.quality}</span>
                    </div>
                    {['dataSaver', 'notifications'].map(setting => (
                        <div key={setting} onClick={() => setAppSettings(p => ({...p, [setting]: !p[setting]}))} className="flex items-center justify-between cursor-pointer mb-4">
                            <div className="flex items-center gap-3">{setting === 'dataSaver' ? <Smartphone size={20} /> : <Bell size={20} />}<span className={`capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{setting.replace(/([A-Z])/g, ' $1').trim()}</span></div>
                            <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${appSettings[setting] ? 'bg-purple-600' : (isDarkMode ? 'bg-white/20' : 'bg-gray-200')}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${appSettings[setting] ? 'left-5' : 'left-1'}`} /></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const PolicyView = () => (<div className="pt-8 px-6 pb-40 min-h-screen animate-fade-in"><Header title="Privacy Policy" /><div className={`p-6 rounded-3xl border text-sm leading-relaxed overflow-y-auto h-[60vh] ${isDarkMode ? 'bg-white/5 border-white/10 text-white/80' : 'bg-white border-gray-200 text-gray-600'}`}><p>Privacy Policy Content Here...</p></div></div>);
    const HelpView = () => {
        const [open, setOpen] = useState(null);
        return (
            <div className="pt-8 px-6 pb-40 min-h-screen animate-fade-in"><Header title="Help Centre" />
            <div className="space-y-4">{['How to create playlist?', 'Audio Quality?'].map((q, i) => (<div key={i} onClick={() => setOpen(open === i ? null : i)} className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>{q} {open === i && <p className="mt-2 text-sm opacity-60">Answer here...</p>}</div>))}</div>
            <button onClick={() => alert("Support Contacted")} className="mt-8 px-6 py-2 bg-purple-600 text-white rounded-full">Contact Support</button></div>
        );
    };

    if (view === 'main') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent pb-24">
                <div className="text-center p-8 w-full max-w-sm animate-fade-in">
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className={`absolute top-8 right-8 p-3 rounded-full backdrop-blur-md border shadow-lg ${isDarkMode ? 'bg-white/10 text-yellow-300' : 'bg-white/80 text-purple-600'}`}>{isDarkMode ? <Sun size={24} /> : <Moon size={24} />}</button>
                    <div className="mb-10"><div className="w-28 h-28 bg-gradient-to-tr from-purple-500/80 to-blue-600/80 backdrop-blur-lg rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl border border-white/20"><Music size={56} className="text-white drop-shadow-md" /></div><h1 className={`text-4xl font-bold mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Auxo</h1><p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Vudia Entertainments</p></div>
                    <div className="space-y-1"><MenuItem icon={User} title="Account Information" onClick={() => setView('account')} /><MenuItem icon={Settings} title="Settings & Privacy" onClick={() => setView('settings')} /><MenuItem icon={Shield} title="Privacy Policy" onClick={() => setView('policy')} /><MenuItem icon={HelpCircle} title="Help Centre" onClick={() => setView('help')} /><div className="my-4 h-px bg-white/10" /><MenuItem icon={LogOut} title="Log Out" destructive onClick={() => confirm("Log out?") && alert("Logged out")} /></div>
                </div>
            </div>
        );
    }
    if (view === 'account') return <AccountView />;
    if (view === 'settings') return <SettingsView />;
    if (view === 'policy') return <PolicyView />;
    if (view === 'help') return <HelpView />;
    return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  // FIX: Using renamed 'dbSongs' for initial state
  const [songs, setSongs] = useState(dbSongs); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  
  // Audio Element Ref
  const audioUrl = songs && songs.length > 0 ? songs[0].audioUrl : '';
  const audioRef = useRef(new Audio(audioUrl));

  useEffect(() => {
      if (!songs || songs.length === 0) return;
      
      audioRef.current.src = songs[currentIndex].audioUrl;
      if (isPlaying) audioRef.current.play().catch(e => console.log("Playback error:", e));
      
      const handleEnded = () => {
          if (repeatMode === 2) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
          } else {
              handleNext();
          }
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
          audioRef.current.pause();
          audioRef.current.removeEventListener('ended', handleEnded);
      };
  }, [currentIndex, songs, repeatMode]);

  useEffect(() => {
      if (isPlaying) audioRef.current.play().catch(e => console.log("Play error", e));
      else audioRef.current.pause();
  }, [isPlaying]);

  const handleNext = () => {
    if (!songs || songs.length === 0) return;
    if (isShuffle) {
        let nextIndex = Math.floor(Math.random() * songs.length);
        while (nextIndex === currentIndex && songs.length > 1) {
            nextIndex = Math.floor(Math.random() * songs.length);
        }
        setCurrentIndex(nextIndex);
    } else {
        setCurrentIndex((prev) => (prev + 1) % songs.length);
    }
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (!songs || songs.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleRepeat = () => setRepeatMode((prev) => (prev + 1) % 3);

  const playSpecificSong = (song) => {
    const index = songs.findIndex(s => s.id === song.id);
    if (index !== -1) {
        setCurrentIndex(index);
        setIsPlaying(true);
    }
  };

  if (!songs || songs.length === 0) {
      return <div className="min-h-screen flex items-center justify-center text-white bg-black">Loading Database...</div>
  }

  return (
    <div className={`min-h-screen font-sans overflow-hidden select-none md:max-w-md md:mx-auto md:shadow-2xl md:border-x relative transition-colors duration-700 ease-in-out
      ${isDarkMode 
        ? 'bg-black bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white md:border-white/10' 
        : 'bg-white bg-gradient-to-br from-blue-50 via-purple-50 to-white text-gray-900 md:border-gray-200'}`}>
      
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }`}</style>

      {/* Passing 'songs' prop correctly to child components */}
      {activeTab === 'home' && <Home onPlaySong={playSpecificSong} isDarkMode={isDarkMode} songs={songs} />}
      {activeTab === 'discover' && <LibraryPage isDarkMode={isDarkMode} onPlaySong={playSpecificSong} songs={songs} />}
      {activeTab === 'search' && <SearchPage songs={songs} onPlay={playSpecificSong} isDarkMode={isDarkMode} />}
      {activeTab === 'me' && <MePage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}

      <SongFeedItem 
        song={songs[currentIndex]} 
        isActive={isPlayerOpen} 
        isPlaying={isPlaying} 
        onPlayToggle={() => setIsPlaying(!isPlaying)} 
        onNext={handleNext} 
        onPrev={handlePrev} 
        onClose={() => setIsPlayerOpen(false)}
        isShuffle={isShuffle}
        toggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        toggleRepeat={toggleRepeat}
      />
      <FloatingPlayer song={songs[currentIndex]} isPlaying={isPlaying} onPlayToggle={() => setIsPlaying(!isPlaying)} onExpand={() => setIsPlayerOpen(true)} isDarkMode={isDarkMode} />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} />
      
      <div className={`hidden md:block absolute -right-48 top-10 w-40 text-sm ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}><p>Tip: Use Up/Down arrow keys to switch songs.</p></div>
    </div>
  );
}