"use client";

import {
    BarChart2,
    Book,
    ChevronDown,
    ChevronRight,
    DollarSign,
    Home,
    Menu,
    Settings,
    Users,
} from "lucide-react";
import { JSX, useState } from "react";

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openSections, setOpenSections] = useState<{
        [key: string]: boolean;
    }>({});

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const NavItem = ({
        icon,
        text,
        collapsed,
    }: {
        icon: JSX.Element;
        text: string;
        collapsed: boolean;
    }) => {
        return (
            <div className="flex items-center gap-4 p-3 hover:bg-gray-700 cursor-pointer rounded-md text-lg font-medium">
                {icon}
                {!collapsed && <span>{text}</span>}
            </div>
        );
    };

    const CollapsibleItem = ({
        icon,
        text,
        collapsed,
        open,
        onToggle,
        subItems,
    }: {
        icon: JSX.Element;
        text: string;
        collapsed: boolean;
        open?: boolean;
        onToggle: () => void;
        subItems: string[];
    }) => {
        return (
            <div>
                <div
                    className="flex items-center gap-4 p-3 hover:bg-gray-700 cursor-pointer rounded-md text-lg font-medium"
                    onClick={onToggle}
                >
                    {icon}
                    {!collapsed && <span className="flex-1">{text}</span>}
                    {!collapsed && (open ? <ChevronDown /> : <ChevronRight />)}
                </div>
                {!collapsed && open && (
                    <div className="ml-6 space-y-2 mt-2 border-l border-gray-600 pl-4 text-sm">
                        {subItems.map((item) => (
                            <div
                                key={item}
                                className="p-2 hover:bg-gray-700 rounded-md cursor-pointer"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <aside
            className={`bg-gray-900 text-white transition-all h-full ${
                collapsed ? "w-16" : "w-64"
            }`}
        >
            <div className="p-4 flex items-center justify-between">
                {!collapsed && <span className="text-lg font-bold">Panel</span>}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
                >
                    <Menu size={20} />
                </button>
            </div>
            <nav className="space-y-2 px-2">
                <NavItem
                    icon={<Home />}
                    text="Dashboard"
                    collapsed={collapsed}
                />
                <CollapsibleItem
                    icon={<Users />}
                    text="Alumnos y Grupos"
                    collapsed={collapsed}
                    open={openSections["alumnos"]}
                    onToggle={() => toggleSection("alumnos")}
                    subItems={[
                        "Registro y gestión de alumnos",
                        "Administración de grupos y materias",
                        "Reportes de asistencia y calificaciones",
                    ]}
                />
                <NavItem
                    icon={<Book />}
                    text="Maestros"
                    collapsed={collapsed}
                />
                <NavItem
                    icon={<DollarSign />}
                    text="Finanzas y Pagos"
                    collapsed={collapsed}
                />
                <NavItem
                    icon={<BarChart2 />}
                    text="Reportes y Estadísticas"
                    collapsed={collapsed}
                />
                <NavItem
                    icon={<Settings />}
                    text="Configuración"
                    collapsed={collapsed}
                />
            </nav>
        </aside>
    );
};

export default AdminSidebar;
