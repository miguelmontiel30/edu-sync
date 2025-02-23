'use client';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {usePathname} from 'next/navigation';
import {useSidebar} from '@/context/SidebarContext';

// Icons
import {
    Grid as GridIcon,
    Calendar as CalenderIcon,
    ChevronDown as ChevronDownIcon,
    MoreHorizontal as HorizontaLDots,
    PieChart as PieChartIcon,
    User as UserCircleIcon,
    Users,
    User,
} from 'lucide-react';

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: {name: string; path: string; pro?: boolean; new?: boolean}[];
};

const navItems: NavItem[] = [
    {
        icon: <GridIcon size={20} />,
        name: 'Inicio',
        path: '/',
    },
    {
        name: 'Alumnos y grupos',
        icon: <User size={20} />,
        subItems: [
            {name: 'Registro y gestión de alumnos', path: '/admin-dashboard/students', pro: false},
            {name: 'Administración de grupos y materias', path: '/form-elements', pro: false},
            {name: 'Reportes de asistencia y calificaciones', path: '/form-elements', pro: false},
        ],
    },
    {
        name: 'Maestros',
        icon: <Users size={20} />,
        path: '/profile',
    },
    {
        icon: <CalenderIcon size={20} />,
        name: 'Calendario',
        path: '/calendar',
    },
];

const othersItems: NavItem[] = [
    {
        name: 'Finanzas y pagos',
        icon: <PieChartIcon size={20} />,
        subItems: [
            {name: 'Blank Page', path: '/blank', pro: false},
            {name: '404 Error', path: '/error-404', pro: false},
        ],
    },
    {
        icon: <UserCircleIcon size={20} />,
        name: 'Mi Perfil',
        path: '/profile',
    },
];

const AdminSidebar: React.FC = () => {
    // Hooks
    const {isExpanded, isMobileOpen, isHovered, setIsHovered} = useSidebar();
    const pathname = usePathname();

    // States
    const [openSubmenu, setOpenSubmenu] = useState<{
        type: 'main' | 'others';
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});

    // Refs
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Functions
    const isActive = useCallback((path: string) => path === pathname, [pathname]);

    /**
     * Check if the current path is active and set the submenu accordingly
     * when the component mounts or the pathname changes
     */
    useEffect(() => {
        // Check if the current path matches any submenu item
        let submenuMatched = false;
        ['main', 'others'].forEach(menuType => {
            const items = menuType === 'main' ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (nav.subItems) {
                    nav.subItems.forEach(subItem => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as 'main' | 'others',
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [pathname, isActive]);

    /**
     * Set the height of the submenu items when the submenu is opened or closed
     * to create a smooth transition
     */
    useEffect(() => {
        // Set the height of the submenu items when the submenu is opened
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight(prevHeights => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    /**
     *
     * @param index index of the submenu item
     * @param menuType type of the menu (main | others)
     */
    const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
        setOpenSubmenu(prevOpenSubmenu => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return {type: menuType, index};
        });
    };

    /**
     * Render the menu items based on the type of the menu (main | others)
     * @param items
     * @param menuType
     * @returns
     */
    const renderMenuItems = (items: NavItem[], menuType: 'main' | 'others') => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group ${
                                openSubmenu?.type === menuType && openSubmenu?.index === index
                                    ? 'menu-item-active'
                                    : 'menu-item-inactive'
                            } cursor-pointer ${
                                !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'
                            }`}
                        >
                            <span
                                className={` ${
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? 'menu-item-icon-active'
                                        : 'menu-item-icon-inactive'
                                }`}
                            >
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className={`menu-item-text`}>{nav.name}</span>
                            )}
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <ChevronDownIcon
                                    className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                                        openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                            ? 'rotate-180 text-brand-500'
                                            : ''
                                    }`}
                                />
                            )}
                        </button>
                    ) : (
                        nav.path && (
                            <Link
                                href={nav.path}
                                className={`menu-item group ${
                                    isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                                }`}
                            >
                                <span
                                    className={`${
                                        isActive(nav.path)
                                            ? 'menu-item-icon-active'
                                            : 'menu-item-icon-inactive'
                                    }`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className={`menu-item-text`}>{nav.name}</span>
                                )}
                            </Link>
                        )
                    )}

                    {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                        <div
                            ref={el => {
                                subMenuRefs.current[`${menuType}-${index}`] = el;
                            }}
                            className="overflow-hidden transition-all duration-300"
                            style={{
                                height:
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? `${subMenuHeight[`${menuType}-${index}`]}px`
                                        : '0px',
                            }}
                        >
                            <ul className="ml-9 mt-2 space-y-1">
                                {nav.subItems.map(subItem => (
                                    <li key={subItem.name}>
                                        <Link
                                            href={subItem.path}
                                            className={`menu-dropdown-item ${
                                                isActive(subItem.path)
                                                    ? 'menu-dropdown-item-active'
                                                    : 'menu-dropdown-item-inactive'
                                            }`}
                                        >
                                            {subItem.name}
                                            <span className="ml-auto flex items-center gap-1">
                                                {subItem.new && (
                                                    <span
                                                        className={`ml-auto ${
                                                            isActive(subItem.path)
                                                                ? 'menu-dropdown-badge-active'
                                                                : 'menu-dropdown-badge-inactive'
                                                        } menu-dropdown-badge`}
                                                    >
                                                        new
                                                    </span>
                                                )}
                                                {subItem.pro && (
                                                    <span
                                                        className={`ml-auto ${
                                                            isActive(subItem.path)
                                                                ? 'menu-dropdown-badge-active'
                                                                : 'menu-dropdown-badge-inactive'
                                                        } menu-dropdown-badge`}
                                                    >
                                                        pro
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed left-0 top-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:mt-0 ${(() => {
                if (isExpanded || isMobileOpen) return 'w-[290px]';
                if (isHovered) return 'w-[290px]';
                return 'w-[90px]';
            })()} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`flex py-8 ${
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                }`}
            >
                <Link href="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <Image
                                className="dark:hidden"
                                src="/images/logo/logo.svg"
                                alt="Logo"
                                width={150}
                                height={40}
                            />
                            <Image
                                className="hidden dark:block"
                                src="/images/logo/logo-dark.svg"
                                alt="Logo"
                                width={150}
                                height={40}
                            />
                        </>
                    ) : (
                        <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
                    )}
                </Link>
            </div>
            <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 flex text-xs uppercase leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? 'lg:justify-center'
                                        : 'justify-start'
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    'Menu'
                                ) : (
                                    <HorizontaLDots size={16} />
                                )}
                            </h2>
                            {renderMenuItems(navItems, 'main')}
                        </div>

                        <div className="">
                            <h2
                                className={`mb-4 flex text-xs uppercase leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? 'lg:justify-center'
                                        : 'justify-start'
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    'Otros'
                                ) : (
                                    <HorizontaLDots size={16} />
                                )}
                            </h2>
                            {renderMenuItems(othersItems, 'others')}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;
