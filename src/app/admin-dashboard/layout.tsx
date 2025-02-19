import AdminSidebar from "@/components/navigation/AdminSidebar";
import AdminNavbar from "@/components/navigation/AdminNavbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminNavbar />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
