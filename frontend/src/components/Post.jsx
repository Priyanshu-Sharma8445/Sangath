

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://sangath.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://sangath.onrender.com/api/v1/post/${post._id}/comment`, { text }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`https://sangath.onrender.com/api/v1/post/delete/${post?._id}`, { withCredentials: true })
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messsage);
        }
    }

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://sangath.onrender.com/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        // GLASS CARD CONTAINER
        <div className='my-8 w-full max-w-sm mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 shadow-xl'>
            
            {/* Header */}
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center gap-2'>
                    <Avatar className="w-9 h-9 border border-white/10">
                        <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                        <AvatarFallback className="bg-slate-700 text-white">CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-2'>
                        <h1 className='font-semibold text-sm text-slate-100'>{post.author?.username}</h1>
                        {user?._id === post.author._id && <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 text-[10px]">Author</Badge>}
                    </div>
                </div>
                
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer text-slate-400 hover:text-white transition-colors' />
                    </DialogTrigger>
                    {/* Updated Dialog Content for Dark Mode */}
                    <DialogContent className="flex flex-col items-center text-sm text-center bg-slate-900 border border-white/10 text-slate-200">
                        {post?.author?._id !== user?._id && 
                            <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold hover:bg-white/5 hover:text-[#ED4956]">Unfollow</Button>
                        }
                        <Button variant='ghost' className="cursor-pointer w-fit hover:bg-white/5 hover:text-white">Add to favorites</Button>
                        {user && user?._id === post?.author._id && 
                            <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit hover:bg-white/5 text-red-400 hover:text-red-300">Delete</Button>
                        }
                    </DialogContent>
                </Dialog>
            </div>

            {/* Post Image */}
            <div className="rounded-xl overflow-hidden border border-white/5">
                <img
                    className='w-full aspect-square object-cover hover:scale-105 transition-transform duration-500'
                    src={post.image}
                    alt="post_img"
                />
            </div>

            {/* Actions */}
            <div className='flex items-center justify-between my-3'>
                <div className='flex items-center gap-4'>
                    {liked ? (
                        <FaHeart onClick={likeOrDislikeHandler} size={'22'} className='cursor-pointer text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' />
                    ) : (
                        <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer text-slate-300 hover:text-white transition-colors' />
                    )}

                    <MessageCircle 
                        onClick={() => {
                            dispatch(setSelectedPost(post));
                            setOpen(true);
                        }} 
                        size={'22px'}
                        className='cursor-pointer text-slate-300 hover:text-indigo-400 transition-colors' 
                    />
                    <Send size={'22px'} className='cursor-pointer text-slate-300 hover:text-indigo-400 transition-colors' />
                </div>
                <Bookmark onClick={bookmarkHandler} size={'22px'} className='cursor-pointer text-slate-300 hover:text-yellow-400 transition-colors' />
            </div>

            {/* Likes & Caption */}
            <span className='font-semibold block mb-2 text-sm text-slate-100'>{postLike} likes</span>
            <p className='text-sm text-slate-300 leading-relaxed'>
                <span className='font-semibold mr-2 text-white'>{post.author?.username}</span>
                {post.caption}
            </p>

            {/* View Comments Link */}
            {comment.length > 0 && (
                <span 
                    onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true);
                    }} 
                    className='cursor-pointer text-sm text-slate-500 hover:text-slate-300 transition-colors mt-1 block'
                >
                    View all {comment.length} comments
                </span>
            )}

            <CommentDialog open={open} setOpen={setOpen} />

            {/* Comment Input */}
            <div className='flex items-center justify-between mt-3 pt-3 border-t border-white/10'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full bg-transparent text-slate-200 placeholder:text-slate-600'
                />
                {text && (
                    <span onClick={commentHandler} className='text-indigo-400 font-medium cursor-pointer hover:text-indigo-300 transition-colors text-sm'>
                        Post
                    </span>
                )}
            </div>
        </div>
    )
}

export default Post