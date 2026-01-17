import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePicture: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePicture: file });
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if(input.profilePicture){
            formData.append("profilePicture", input.profilePicture);
        }
        try {
            setLoading(true);
            const res = await axios.post('https://sangath.onrender.com/api/v1/user/profile/edit', formData,{
                headers:{ 'Content-Type':'multipart/form-data' },
                withCredentials:true
            });
            if(res.data.success){
                const updatedUserData = {
                    ...user,
                    bio:res.data.user?.bio,
                    profilePicture:res.data.user?.profilePicture,
                    gender:res.data.user.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.messasge);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className='flex max-w-2xl mx-auto pl-10 h-full justify-center items-center'>
            {/* GLASS CONTAINER */}
            <section className='flex flex-col gap-6 w-full my-8 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-2xl'>
                
                <h1 className='font-bold text-xl text-slate-100 border-b border-white/10 pb-4'>Edit Profile</h1>
                
                {/* Profile Photo Section */}
                <div className='flex items-center justify-between bg-black/20 rounded-xl p-4 border border-white/5'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="w-14 h-14 border border-white/20">
                            <AvatarImage src={user?.profilePicture} alt="post_image" className="object-cover" />
                            <AvatarFallback className="bg-slate-800 text-white">CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-bold text-sm text-slate-100'>{user?.username}</h1>
                            <span className='text-slate-400 text-xs'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' />
                    <Button onClick={() => imageRef?.current.click()} className='bg-indigo-600 hover:bg-indigo-700 text-white h-9 border-0'>Change photo</Button>
                </div>
                
                {/* Bio Section */}
                <div>
                    <h1 className='font-bold text-xl mb-2 text-slate-200'>Bio</h1>
                    <Textarea 
                        value={input.bio} 
                        onChange={(e) => setInput({ ...input, bio: e.target.value })} 
                        name='bio' 
                        className="focus-visible:ring-offset-0 focus-visible:ring-0 bg-black/20 border-white/10 text-slate-200 placeholder:text-slate-600 min-h-[100px]" 
                        placeholder="Tell us a little bit about yourself..."
                    />
                </div>
                
                {/* Gender Section */}
                <div>
                    <h1 className='font-bold mb-2 text-slate-200'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full bg-black/20 border-white/10 text-slate-200 focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-slate-200">
                            <SelectGroup>
                                <SelectItem value="male" className="focus:bg-indigo-600 focus:text-white cursor-pointer">Male</SelectItem>
                                <SelectItem value="female" className="focus:bg-indigo-600 focus:text-white cursor-pointer">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Submit Button */}
                <div className='flex justify-end pt-4 border-t border-white/10'>
                    {
                        loading ? (
                            <Button className='w-fit bg-indigo-600 hover:bg-indigo-700 text-white'>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={editProfileHandler} className='w-fit bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300'>Submit</Button>
                        )
                    }
                </div>
            </section>
        </div>
    )
}

export default EditProfile