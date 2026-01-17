import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle, Grid3X3, Bookmark, Layers, Tag } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id; 
  // console.log(user);
  // console.log(userProfile);
  // console.log(isLoggedInUserProfile);
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.post : userProfile?.bookmark;

  return (
    // MAIN CONTAINER: Text white to be visible on Galaxy Background
    <div className='flex max-w-5xl justify-center mx-auto pl-10 text-slate-100'>
      <div className='flex flex-col gap-20 p-8 w-full'>
        
        {/* --- PROFILE HEADER SECTION --- */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
          
          {/* Avatar Area */}
          <section className='flex items-center justify-center'>
            <div className="relative group">
                {/* Glowing ring behind avatar */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <Avatar className='h-32 w-32 border-4 border-black/50 relative'>
                    <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" className="object-cover" />
                    <AvatarFallback className="bg-slate-800 text-white text-2xl">AN</AvatarFallback>
                </Avatar>
            </div>
          </section>

          {/* User Info Area */}
          <section>
            <div className='flex flex-col gap-5'>
              
              {/* Username & Actions */}
              <div className=' items-center gap-4 flex-wrap'>
                <div className='font-bold text-2xl tracking-wide mb-3'>{userProfile?.username}</div>
                
                {
                  isLoggedInUserProfile ? (
                    <div className='flex gap-2'>
                      <Link to="/account/edit">
                        <Button variant='secondary' className='h-8 bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all'>Edit profile</Button>
                      </Link>
                      <Button variant='secondary' className='h-8 bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all'>View archive</Button>
                      <Button variant='secondary' className='h-8 bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all'>Ad tools</Button>
                    </div>
                  ) : (
                    isFollowing ? (
                      <div className='flex gap-2'>
                        <Button variant='secondary' className='h-8 bg-white/10 hover:bg-white/20 text-white border border-white/10'>Unfollow</Button>
                        <Button variant='secondary' className='h-8 bg-white/10 hover:bg-white/20 text-white border border-white/10'>Message</Button>
                      </div>
                    ) : (
                      <Button className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white h-8 border-0'>Follow</Button>
                    )
                  )
                }
              </div>

              {/* Stats */}
              <div className='flex items-center gap-8 text-sm md:text-base'>
                <p><span className='font-bold text-white'>{userProfile?.post.length}</span><span className='text-slate-400'>posts</span></p>
                <p><span className='font-bold text-white'>{userProfile?.follower.length} </span><span className='text-slate-400'>followers</span></p>
                <p><span className='font-bold text-white'>{userProfile?.following.length} </span><span className='text-slate-400'>following</span></p>
              </div>

              {/* Bio Section */}
              <div className='flex flex-col gap-2 text-sm'>
                <span className='font-semibold text-slate-100'>{userProfile?.bio || 'bio here...'}</span>
                
                <Badge className='w-fit bg-indigo-500/20 text-indigo-200 border-indigo-500/30 hover:bg-indigo-500/30 gap-1 px-2 py-1' variant='secondary'>
                    <AtSign className='w-3 h-3' /> 
                    <span>{userProfile?.username}</span> 
                </Badge>
                
                <div className='text-slate-300 space-y-0.5 mt-1'>
                    <p>Hey!! Welcome to SANGATH</p>
                    <p>Mern Project !!!!</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- TABS & GRID SECTION --- */}
        <div className='border-t border-white/10'>
          
          {/* Tabs */}
          <div className='flex items-center justify-center gap-12 text-xs md:text-sm tracking-widest'>
            <span 
                className={`py-4 cursor-pointer flex items-center gap-2 border-t-2 transition-all duration-300 ${activeTab === 'posts' ? 'border-white text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'}`} 
                onClick={() => handleTabChange('posts')}
            >
              <Grid3X3 className="w-4 h-4" /> POSTS
            </span>
            <span 
                className={`py-4 cursor-pointer flex items-center gap-2 border-t-2 transition-all duration-300 ${activeTab === 'saved' ? 'border-white text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'}`} 
                onClick={() => handleTabChange('saved')}
            >
              <Bookmark className="w-4 h-4" /> SAVED
            </span>
            <span className='py-4 cursor-pointer flex items-center gap-2 border-t-2 border-transparent text-slate-500 hover:text-slate-300 transition-all'>
                <Layers className="w-4 h-4" /> REELS
            </span>
            <span className='py-4 cursor-pointer flex items-center gap-2 border-t-2 border-transparent text-slate-500 hover:text-slate-300 transition-all'>
                <Tag className="w-4 h-4" /> TAGS
            </span>
          </div>

          {/* Photo Grid */}
          <div className='grid grid-cols-3 gap-1 md:gap-4'>
            {
              displayedPost?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer aspect-square rounded-xl overflow-hidden border border-white/5 bg-white/5'>
                    <img src={post.image} alt='postimage' className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
                    
                    {/* Hover Overlay - Glass Effect */}
                    <div className='absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-6'>
                        <button className='flex items-center gap-2 hover:text-indigo-400 transition-colors font-bold'>
                          <Heart className="fill-white" />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-indigo-400 transition-colors font-bold'>
                          <MessageCircle className="fill-white" />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile