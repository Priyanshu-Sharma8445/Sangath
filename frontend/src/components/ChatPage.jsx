
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, Send, Phone, Video, MoreVertical } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        // MAIN BACKGROUND: Deep dark gradient
        <div className='flex ml-[16%] h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white overflow-hidden relative'>
            
            {/* AMBIENT GLOW EFFECTS (Behind the glass) */}
            <div className='absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none'></div>
            <div className='absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none'></div>

            {/* Sidebar Section - GLASS PANEL 1 */}
            <section className='w-full md:w-80 lg:w-96 flex flex-col border-r border-white/10 bg-white/5 backdrop-blur-lg relative z-10'>
                {/* User Profile Header */}
                <div className='p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-transparent z-10'>
                    <h1 className='font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 truncate px-2'>
                        {user?.username}
                    </h1>
                </div>

                {/* Users List */}
                <div className='overflow-y-auto flex-1 custom-scrollbar p-3 space-y-2'>
                    {suggestedUsers.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        const isSelected = selectedUser?._id === suggestedUser?._id;

                        return (
                            <div 
                                key={suggestedUser?._id}
                                onClick={() => dispatch(setSelectedUser(suggestedUser))} 
                                className={`flex gap-3 items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ease-out group border
                                    ${isSelected 
                                        ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                                        : 'bg-transparent border-transparent hover:bg-white/10 hover:border-white/5'}
                                `}
                            >
                                <div className='relative'>
                                    <Avatar className='w-12 h-12 border-2 border-white/20 shadow-lg'>
                                        <AvatarImage src={suggestedUser?.profilePicture} className="object-cover" />
                                        <AvatarFallback className="bg-slate-700 text-white">{suggestedUser?.username?.slice(0,2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    {isOnline && (
                                        <span className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_#22c55e]'></span>
                                    )}
                                </div>
                                
                                <div className='flex flex-col flex-1 min-w-0'>
                                    <span className={`font-medium text-sm truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                        {suggestedUser?.username}
                                    </span>
                                    <span className={`text-xs font-medium truncate flex items-center gap-1 ${isOnline ? 'text-green-400' : 'text-slate-500'}`}>
                                        {isOnline ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Chat Area Section - GLASS PANEL 2 */}
            {selectedUser ? (
                <section className='flex-1 flex flex-col h-full bg-black/20 relative z-10'>
                    
                    {/* Chat Header - Glass Effect */}
                    <div className='flex items-center justify-between px-6 py-3 border-b border-white/10 bg-slate-900/40 backdrop-blur-md sticky top-0 z-20'>
                        <div className='flex gap-4 items-center'>
                            <Avatar className="w-10 h-10 border border-white/20">
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' className="object-cover" />
                                <AvatarFallback className="bg-slate-700 text-white">CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span className='font-bold text-white text-sm md:text-base'>{selectedUser?.username}</span>
                                {onlineUsers.includes(selectedUser?._id) && (
                                    <span className='text-xs text-green-400 font-medium flex items-center gap-1 shadow-green-500'>
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Icons */}
                        <div className="flex gap-4 text-slate-400">
                            <Phone className="w-5 h-5 cursor-pointer hover:text-indigo-400 transition-colors" />
                            <Video className="w-5 h-5 cursor-pointer hover:text-indigo-400 transition-colors" />
                            <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className='flex-1 overflow-y-auto p-4 custom-scrollbar bg-transparent'>
                        <Messages selectedUser={selectedUser} />
                    </div>

                    {/* Input Area - Glass Footer */}
                    <div className='p-4 bg-slate-900/60 backdrop-blur-lg border-t border-white/10 w-full'>
                        <div className='flex items-center gap-2 max-w-4xl mx-auto'>
                            <Input 
                                value={textMessage} 
                                onChange={(e) => setTextMessage(e.target.value)} 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && textMessage.trim()) {
                                        sendMessageHandler(selectedUser?._id);
                                    }
                                }}
                                type="text" 
                                className='flex-1 py-6 px-4 rounded-full bg-slate-800/50 border border-white/10 focus-visible:ring-2 focus-visible:ring-indigo-500/50 text-white placeholder:text-slate-500 transition-all text-base' 
                                placeholder="Type a message..." 
                            />
                            <Button 
                                onClick={() => sendMessageHandler(selectedUser?._id)} 
                                disabled={!textMessage.trim()}
                                className='rounded-full h-12 w-12 p-0 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10'
                            >
                                <Send className="w-5 h-5 text-white ml-0.5" />
                            </Button>
                        </div>
                    </div>
                </section>
            ) : (
                /* Empty State - Dark Glass */
                <div className='flex-1 flex flex-col items-center justify-center bg-black/20 text-center px-4 z-10'>
                    <div className='bg-white/10 p-6 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.05)] mb-4 animate-bounce-slow backdrop-blur-sm border border-white/5'>
                        <MessageCircleCode className='w-16 h-16 text-indigo-400' />
                    </div>
                    <h1 className='font-bold text-2xl text-white mb-2 tracking-wide'>Your Messages</h1>
                    <p className='text-slate-400 max-w-sm'>
                        Select a chat from the sidebar to start messaging.
                    </p>
                </div>
            )}
        </div>
    )
}

export default ChatPage