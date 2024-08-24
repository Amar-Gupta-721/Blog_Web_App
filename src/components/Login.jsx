import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { Button, Input } from './index';
import { useDispatch } from 'react-redux';
import authService from '../appwrite/auth';
import { useForm } from 'react-hook-form';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    const login = async (data) => {
        setLoading(true)
        setError("");
        try {
            const session = await authService.login({ ...data });
    
            if (session) {
                const userData = await authService.getCurrentUser();
    
                if (userData) {
                    if (userData.emailVerification) {
                        dispatch(authLogin({ userData }));
                        setTimeout(() => {
                            navigate("/");
                        }, 0);
                    } else {
                        await authService.sendVerificationEmail();
                        setError("Your email is not verified. We have sent you a verification link. Please check your email.");
                    }
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <div className='flex items-center justify-center w-full px-3'>
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <h2 className="text-center text-2xl font-bold leading-tight">Log in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link to="/signup" className="font-medium text-primary transition-all duration-200 hover:underline">
                        Sign Up
                    </Link>
                </p>
                {loading && <p className="text-blue-600 mt-8 text-center">Loading...</p>}
                {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className="space-y-5">
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address"
                                }
                            })}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full transition ease-in-out delay-10 bg-blue-500 hover:scale-105 hover:bg-blue-900 duration-200 active:bg-blue-300"
                            children="Sign in"
                        ></Button>
                    </div>
                </form>
                <p className="mt-4 text-center">
                    <Link to="/forgot-password" className="text-blue-600 hover:underline">
                        Forgot Password?
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
