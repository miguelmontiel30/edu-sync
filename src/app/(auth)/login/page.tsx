'use client';

// React
import React, {useState} from 'react';

// Next
import {useRouter} from 'next/navigation';

// Store
import {useAuthStore} from '@/store/useAuthStore';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {login} = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(username, password);
            router.push('/admin-dashboard/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login error here
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md space-y-6 rounded bg-white p-8 shadow-md">
                <h2 className="text-center text-2xl font-bold">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center">
                    <a href="/register" className="text-sm text-indigo-600 hover:underline">
                        ¿No tienes una cuenta? Regístrate aquí
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
