import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../appwrite/auth'; 
import Container from '../components/container/Container'

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAndRedirect = async () => {
            const userId = searchParams.get('userId');
            const secret = searchParams.get('secret');
            
            if (userId && secret) {
                try {
                    const verified = await authService.verifyEmail(userId, secret);
                    if (verified) {
                        console.log("Email verified successfully!");
                        navigate('/');
                    }
                } catch (error) {
                    console.error("Email verification failed:", error);
                }
            }
        };

        verifyAndRedirect();
    }, [searchParams, navigate]);

    return ( <div className="w-full py-8 mt-4 text-center">
        <Container>
            <h1 className="text-2xl font-bold">Loading...</h1>
        </Container>
    </div>
    )
};

export default EmailVerification;