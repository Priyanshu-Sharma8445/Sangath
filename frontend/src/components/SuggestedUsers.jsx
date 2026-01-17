import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    
    return (
        <div className='my-10 py-4 px-2'>
            {/* Header */}
            <div className='flex items-center justify-between text-sm mb-6'>
                <h1 className='font-semibold text-slate-400 tracking-wide'>Suggested for you</h1>
                <span className='font-medium cursor-pointer text-slate-200 hover:text-white transition-colors text-xs'>See All</span>
            </div>
            
            {/* Users List */}
            <div className="flex flex-col gap-4">
                {
                    suggestedUsers.map((user) => {
                        return (
                            <div key={user._id} className='flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-white/5'>
                                <div className='flex items-center gap-3'>
                                    <Link to={`/profile/${user?._id}`} className="relative">
                                        <Avatar className="w-10 h-10 border border-white/10 group-hover:border-indigo-500/50 transition-colors">
                                            <AvatarImage src={user?.profilePicture} alt="post_image" className="object-cover" />
                                            <AvatarFallback className="bg-slate-800 text-white text-xs">CN</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    
                                    <div className='flex flex-col'>
                                        <h1 className='font-semibold text-sm text-slate-100'>
                                            <Link to={`/profile/${user?._id}`} className="hover:text-indigo-400 transition-colors">
                                                {user?.username}
                                            </Link>
                                        </h1>
                                        <span className='text-slate-500 text-xs truncate max-w-[100px] group-hover:text-slate-400 transition-colors'>
                                            {user?.bio || 'Bio here...'}
                                        </span>
                                    </div>
                                </div>
                                
                                <span className='text-indigo-400 text-xs font-bold cursor-pointer hover:text-white hover:bg-indigo-600 px-3 py-1 rounded-full transition-all duration-300'>
                                    Follow
                                </span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SuggestedUsers