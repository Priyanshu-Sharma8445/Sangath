import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Github, Loader2, Lock, Mail, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                
                {/* 2. Modern Card Container */}
                <div className='bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100'>
                    
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <h1 className='font-extrabold text-3xl text-gray-900 tracking-tight'>Create Account</h1>
                        <p className='text-sm text-gray-500 mt-2'>Join us to connect with friends today</p>
                    </div>

                    <form onSubmit={signupHandler} className='flex flex-col gap-5'>
                        
                        {/* Username */}
                        <div className='relative'>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Username</label>
                            <div className='relative'>
                                <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                <Input
                                    type="text"
                                    name="username"
                                    value={input.username}
                                    onChange={changeEventHandler}
                                    placeholder="johndoe"
                                    className="pl-10 focus-visible:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className='relative'>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Email Address</label>
                            <div className='relative'>
                                <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                <Input
                                    type="email"
                                    name="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    placeholder="john@example.com"
                                    className="pl-10 focus-visible:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className='relative'>
                            <label className='text-sm font-medium text-gray-700 block mb-1'>Password</label>
                            <div className='relative'>
                                <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                                <Input
                                    type="password"
                                    name="password"
                                    value={input.password}
                                    onChange={changeEventHandler}
                                    placeholder="••••••••"
                                    className="pl-10 focus-visible:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='mt-4'>
                            {loading ? (
                                <Button disabled className='w-full bg-blue-600 hover:bg-blue-700'>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </Button>
                            ) : (
                                <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 transition-colors shadow-md'>
                                    Sign Up
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Social Login Separator */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Github className="mr-2 h-4 w-4" /> Github
                        </Button>
                    </div>

                    <p className='text-center text-sm text-gray-600 mt-6'>
                        Already have an account?{' '}
                        <Link to="/login" className='text-blue-600 font-semibold hover:underline'>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup