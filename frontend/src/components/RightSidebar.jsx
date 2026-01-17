import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  return (
    <div className='w-fit my-10 pr-32 hidden lg:block'> {/* Added hidden lg:block to prevent layout breakage on mobile */}
      
      {/* Current User Profile - Glass Card */}
      <div className='flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md mb-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer shadow-lg shadow-black/20'>
        
        <Link to={`/profile/${user?._id}`} className='relative'>
            {/* Subtle Glow behind Avatar */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
            <Avatar className="relative border-2 border-white/10 h-12 w-12">
                <AvatarImage src={user?.profilePicture} alt="post_image" className="object-cover" />
                <AvatarFallback className="bg-slate-800 text-white">CN</AvatarFallback>
            </Avatar>
        </Link>
        
        <div className='flex flex-col'>
          <h1 className='font-semibold text-sm text-slate-100 tracking-wide hover:text-indigo-400 transition-colors'>
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className='text-slate-400 text-xs font-medium truncate max-w-[140px]'>
            {user?.bio || 'Bio here...'}
          </span>
        </div>
      </div>

      {/* Suggested Users Component */}
      <SuggestedUsers/>
    </div>
  )
}

export default RightSidebar