import { Search, Bell, User } from "lucide-react";

const AdminNavbar = () => {
    return (
        <header className="bg-white shadow-md flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
                <Search className="text-gray-500" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="border rounded px-2 py-1 text-gray-700"
                />
            </div>
            <div className="flex items-center gap-4">
                <Bell className="text-gray-500 cursor-pointer" />
                <User className="text-gray-500 cursor-pointer" />
            </div>
        </header>
    );
};

export default AdminNavbar;
