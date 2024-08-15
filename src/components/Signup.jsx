import React, { useState } from "react";
import authService from "../appwrite/auth";
import { useNavigate } from 'react-router-dom';
import { login } from "../store/authSlice";
import { Button, Input } from './index';
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit } = useForm();

    const create = async (data) => {
        setError("");
        setLoading(true);
        try {
            const userAccount = await authService.createAccount({ ...data });
            if (userAccount) {
                const currentUserData = await authService.getCurrentUser();

                if (currentUserData && currentUserData.emailVerification) {
                    dispatch(login({ userData: currentUserData }));
                    navigate("/");
                } else {
                    setMessage("Please check your email and verify your account before Signup...");
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center px-3 w-full">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <h2 className="text-center text-2xl font-bold leading-tight mb-3">
                    Create a new Account 
                </h2>
                {message && <p className="text-green-600 mt-8 text-center">{message}</p>}
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                
                {loading && <p className="text-blue-600 mt-8 text-center">Sending email verification...</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className="space-y-5">
                        <Input
                            label="Full Name: "
                            placeholder="Enter your Full Name"
                            {...register("name", { required: true })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address"
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your Password"
                            {...register("password", { required: true })}
                        />
                        <Button
                            type="submit"
                            className="w-full transition ease-in-out delay-10 bg-blue-500 hover:scale-105 hover:bg-blue-900 duration-200 active:bg-blue-300"
                            children="Create Account"
                            disabled={loading} 
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
