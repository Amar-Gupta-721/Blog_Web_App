import React, { useState } from 'react';
import authService from '../appwrite/auth'; 
import { useForm } from 'react-hook-form';
import { Input, Button } from '../components';

const ForgotPassword = () => {
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const sendPasswordResetEmail = async (data) => {
        setError('');
        setSuccess('');

        try {
            await authService.sendPasswordRecovery(data.email);
            setSuccess('Password reset link has been sent to your email.');
        } catch (error) {
            setError('Failed to send password reset email: ' + error.message);
        }
    };

    return (
        <div className='py-8'>
            <div className='flex items-center justify-center w-full px-3'>
            <div className="mx-auto text-white w-full max-w-lg rounded-xl p-10 border border-black/10 backdrop-blur-3xl">
                <h2 className="text-center text-2xl font-bold leading-tight">Forgot Password</h2>
                <p className="mt-2 text-center text-base text-white">
                    Enter your email address to receive a password reset link.
                </p>
                {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
                {success && <p className='text-green-600 mt-8 text-center'>{success}</p>}
                <form onSubmit={handleSubmit(sendPasswordResetEmail)} className='mt-8'>
                    <div className="space-y-5">
                        <Input
                            label="Email: "
                            placeholder="Enter your registered email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address"
                                }
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full transition ease-in-out delay-10 bg-blue-500 hover:scale-105 hover:bg-blue-900 duration-200 active:bg-blue-300"
                            children="Send Reset Link"
                        ></Button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default ForgotPassword;
