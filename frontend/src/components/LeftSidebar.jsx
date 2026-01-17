

import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, Menu, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();

    // UI States
    const [open, setOpen] = useState(false); // Create Post Modal
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar Expanded/Collapsed
    const [isMobile, setIsMobile] = useState(false); // Mobile Detection

    // Responsive Logic
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsMobile(true);
                setIsSidebarOpen(false); // Default close on mobile
            } else if (window.innerWidth < 1024) {
                setIsMobile(false);
                setIsSidebarOpen(false); // Default icon-only on tablet
            } else {
                setIsMobile(false);
                setIsSidebarOpen(true); // Default open on desktop
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('https://sangath.onrender.com/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        }
    }

    const sidebarItems = [
        { icon: <Home className="w-6 h-6" />, text: "Home" },
        { icon: <Search className="w-6 h-6" />, text: "Search" },
        { icon: <TrendingUp className="w-6 h-6" />, text: "Explore" },
        { icon: <MessageCircle className="w-6 h-6" />, text: "Messages" },
        { icon: <Heart className="w-6 h-6" />, text: "Notifications" },
        { icon: <PlusSquare className="w-6 h-6" />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6 border border-white/20 shadow-inner'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback className="bg-slate-800 text-white">CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut className="w-6 h-6" />, text: "Logout" },
    ]

    return (
        <>
            {/* MOBILE TRIGGER */}
            {isMobile && !isSidebarOpen && (
                <div className="fixed top-4 left-4 z-50">
                    <Button onClick={() => setIsSidebarOpen(true)} size="icon" className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-indigo-600/50">
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>
            )}

            {/* MAIN SIDEBAR CONTAINER */}
            <div className={`
                h-screen transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] z-40
                border-r border-white/10 text-slate-100 backdrop-blur-xl
                ${isMobile
                    ? `fixed top-0 ${isSidebarOpen ? 'left-0 w-[280px]' : '-left-full w-0'}` // Mobile: Fixed Overlay
                    : 'sticky top-0' // Desktop: STICKY (Pins to top, but takes up space)
                }
                ${!isMobile && (isSidebarOpen ? 'w-[16%] min-w-[240px]' : 'w-[80px]')}
            `}>

                {/* Ambient Glow */}
                <div className="absolute top-0 left-0 w-full h-40 bg-indigo-600/10 blur-[60px] pointer-events-none opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-full h-40 bg-purple-600/10 blur-[60px] pointer-events-none opacity-50"></div>

                <div className='flex flex-col relative z-20 h-full'>

                    {/* HEADER */}
                    <div className={`flex items-center my-8 ${isSidebarOpen ? 'px-6 justify-between' : 'justify-center'}`}>
                        {/* Logo/Name */}
                        {isSidebarOpen && (
                            <h1 className='font-bold text-2xl tracking-wider bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent animate-in fade-in duration-300'>
                                Sangath
                            </h1>
                        )}

                        {/* Toggle Button */}
                        <div
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className='cursor-pointer p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors'
                        >
                            {isMobile ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </div>
                    </div>

                    {/* NAVIGATION ITEMS */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 py-4">
                        {
                            sidebarItems.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            sidebarHandler(item.text);
                                            if (isMobile) setIsSidebarOpen(false);
                                        }}
                                        key={index}
                                        className={`
                                            flex items-center relative cursor-pointer mx-3 rounded-2xl transition-all duration-300 group border border-transparent
                                            ${isSidebarOpen ? 'px-4 py-3 gap-4 hover:bg-white/5 hover:border-white/5 hover:pl-6' : 'justify-center py-3 hover:bg-white/10'}
                                        `}
                                    >
                                        <div className='text-slate-400 group-hover:text-indigo-400 transition-colors duration-300 relative z-10'>
                                            {item.icon}
                                        </div>

                                        {isSidebarOpen && (
                                            <span className='font-medium text-slate-300 group-hover:text-white transition-colors duration-300 whitespace-nowrap animate-in fade-in slide-in-from-left-2'>
                                                {item.text}
                                            </span>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />

                                        {item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div className={`absolute cursor-pointer flex items-center justify-center ${isSidebarOpen ? 'top-1/2 -translate-y-1/2 right-4' : 'top-2 right-2'}`}>
                                                        <span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-black"></span>
                                                        </span>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="bg-slate-950/90 border border-white/10 text-slate-100 backdrop-blur-xl shadow-2xl w-80 ml-4 rounded-xl">
                                                    <div>
                                                        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
                                                            <h4 className="font-semibold text-indigo-300 text-sm">Activity</h4>
                                                            <span className="text-xs text-slate-500">{likeNotification.length} new</span>
                                                        </div>
                                                        {likeNotification.length === 0 ? (<p className="text-slate-500 text-sm py-2">No new notifications</p>) : (
                                                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                                {likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-3 my-2 hover:bg-white/5 p-2 rounded-lg transition-colors cursor-pointer group/item'>
                                                                            <Avatar className="w-9 h-9 border border-white/10">
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback className="bg-slate-800 text-xs">CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <div className='flex flex-col'>
                                                                                <p className='text-sm text-slate-300'>
                                                                                    <span className='font-bold text-white group-hover/item:text-indigo-300 transition-colors'>{notification.userDetails?.username}</span>
                                                                                </p>
                                                                                <p className="text-xs text-slate-500">liked your post</p>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <CreatePost open={open} setOpen={setOpen} />

            </div>

            {isMobile && isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-in fade-in duration-300"
                />
            )}
        </>
    )
}

export default LeftSidebar