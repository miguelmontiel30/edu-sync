"use client";

// React
import { useEffect } from "react";

// Next
import { useRouter } from "next/navigation";

// Store
import { useAuthStore } from "@/store/useAuthStore";

// Global styles
import "./UI/globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, fetchUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
