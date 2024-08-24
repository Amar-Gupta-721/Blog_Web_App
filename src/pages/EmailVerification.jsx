import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../appwrite/auth'; 
import Container from '../components/container/Container'

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null)

    useEffect(() => {
        const verifyAndRedirect = async () => {
            const userId = searchParams.get('userId');
            const secret = searchParams.get('secret');
            
            if (userId && secret) {
                try {
                    const verified = await authService.verifyEmail(userId, secret);
                    if (verified) {
                        navigate('/');
                    }
                    else {
                        setError('Email verification failed. Please try again.');
                    }
                } catch (error) {
                    setError('An error occurred during verification. Please try again.');
                }
            }
            else {
                setError('Invalid verification link. Please check your email and try again.');
            }
        };

        verifyAndRedirect();
    }, [searchParams,navigate]);

    return ( <div className="w-full py-8 mt-4 text-center">
        <Container>
            <h1 className="text-2xl font-bold">Home Page Loading...</h1>
        </Container>
    </div>
    )
};

export default EmailVerification;