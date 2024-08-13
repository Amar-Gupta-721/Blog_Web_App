import React, { useState } from 'react';
import authService from '../appwrite/auth'; 
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input, Button } from '../components';

const ResetPassword = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const resetPassword = async (data) => {
        setError('');
        setSuccess('');

        const userId = searchParams.get('userId');
        const secret = searchParams.get('secret');
        if (!userId || !secret) {
            setError('Invalid password reset link.');
            return;
        }

        try {
            await authService.resetPassword(userId, secret, data.newPassword);
            setSuccess('Password has been reset successfully.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setError('Failed to reset password: ' + error.message);
        }
    };

    return (
        <div className='flex items-center justify-center w-full'>
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <h2 className="text-center text-2xl font-bold leading-tight">Reset Password</h2>
                {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
                {success && <p className='text-green-600 mt-8 text-center'>{success}</p>}
                <form onSubmit={handleSubmit(resetPassword)} className='mt-8'>
                    <div className="space-y-5">
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="Enter your new password"
                            {...register("newPassword", {
                                required: "New password is required",
                                minLength: { value: 6, message: "Password must be at least 6 characters long" }
                            })}
                        />
                        {errors.newPassword && <p className='text-red-600'>{errors.newPassword.message}</p>}
                        <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="Confirm your new password"
                            {...register("confirmNewPassword", {
                                required: "Please confirm your new password",
                                validate: (value) =>
                                    value === watch('newPassword') || 'Password must be same in both blocks'
                            })}
                        />
                        {errors.confirmNewPassword && <p className='text-red-600'>{errors.confirmNewPassword.message}</p>}
                        <Button
                            type="submit"
                            className="w-full transition ease-in-out delay-10 bg-blue-500 hover:scale-105 hover:bg-blue-900 duration-200 active:bg-blue-300"
                            children="Reset Password"
                        ></Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
