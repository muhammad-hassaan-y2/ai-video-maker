import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession, signIn, signOut } from 'next-auth/react';

const AuthPage = () => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const session = await getSession();
            if (!session) {
                signIn(); // Redirect to sign-in page
            }
        };

        checkAuth();
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push('/'); // Redirect to home after sign-out
    };

    return (
        <div>
            <h1>Protected Page</h1>
            <p>You are authenticated!</p>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export default AuthPage;