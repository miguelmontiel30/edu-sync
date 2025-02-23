"use client";

// React
import { useEffect } from "react";

// Next
import { useRouter } from "next/navigation";
import { Outfit } from "next/font/google";

// Store
import { useAuthStore } from "@/store/useAuthStore";

// Global styles
import "./UI/globals.css";

// Contexts
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, fetchUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    return (
        <html lang="es">
            <body className={`${outfit.variable} dark:bg-gray-900`}>
                <ThemeProvider>
                    <SidebarProvider>
                        {children}
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
