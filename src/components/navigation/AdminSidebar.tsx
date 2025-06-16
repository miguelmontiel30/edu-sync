'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';

// Icons
import IconFA from '@/components/ui/IconFA';

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean; icon: string }[];
};

const navItems: NavItem[] = [
    {
        icon: <IconFA icon="school-flag" style="duotone" size="xl" />,
        name: 'Inicio',
        path: '/admin-dashboard',
    },
    {
        icon: <IconFA icon="calendar-clock" style="duotone" size="xl" />,
        name: 'Ciclos escolares',
        path: '/admin-dashboard/admin-school-year',
    },
    {
        name: 'Profesores',
        icon: <IconFA icon="person-chalkboard" style="duotone" size="xl" />,
        subItems: [
            {
                name: 'Mis profesores',
                path: '/admin-dashboard/admin-teachers/',
                pro: false,
                icon: 'chalkboard-teacher',
            },
        ],
    },
    {
        name: 'Alumnos',
        icon: <IconFA icon="user-graduate" style="duotone" size="xl" />,
        subItems: [
            {
                name: 'Mis alumnos',
                path: '/admin-dashboard/admin-students',
                pro: false,
                icon: 'list',
            },
        ],
    },
    {
        name: 'Grupos',
        icon: <IconFA icon="people-group" style="duotone" size="xl" />,
        subItems: [
            {
                name: 'Mis grupos',
                path: '/admin-dashboard/admin-groups',
                pro: false,
                icon: 'users',
            },
            {
                name: 'Grupos y estudiantes',
                path: '/admin-dashboard/admin-groups/admin-groups-students',
                pro: false,
                icon: 'user-graduate',
            },
            {
                name: 'Grupos y materias',
                path: '/admin-dashboard/admin-groups/admin-groups-subjects',
                pro: false,
                icon: 'book-open-reader',
            },
        ],
    },
    {
        name: 'Materias',
        icon: <IconFA icon="books" style="duotone" size="xl" />,
        subItems: [
            {
                name: 'Mis materias',
                path: '/admin-dashboard/admin-subjects',
                pro: false,
                icon: 'book',
            },
        ],
    },
    {
        name: 'Usuarios',
        icon: <IconFA icon="users-viewfinder" style="duotone" size="xl" />,
        subItems: [
            {
                name: 'Administración de usuarios',
                path: '/admin-dashboard/admin-users',
                pro: false,
                icon: 'user-gear',
            },
        ],
    },
];

const othersItems: NavItem[] = [
    {
        name: 'Finanzas y pagos',
        icon: <IconFA icon="chart-mixed-up-circle-dollar" style="duotone" size="xl" />,
        subItems: [
            {
                name: 'Dashboard Financiero',
                path: '/admin-dashboard/admin-finance',
                pro: false,
                icon: 'chart-line',
            },
            {
                name: 'Gestión de Pagos',
                path: '/admin-dashboard/admin-finance/admin-payments',
                pro: false,
                icon: 'money-bill',
            },
        ],
    },
    {
        icon: <IconFA icon="calendar" style="duotone" size="xl" />,
        name: 'Calendario',
        path: '/admin-dashboard/admin-calendar',
    },
    {
        icon: <IconFA icon="id-card" style="duotone" size="xl" />,
        name: 'Mi Perfil',
        path: '/profile',
    },
    {
        icon: <IconFA icon="gear" style="duotone" size="xl" />,
        name: 'Configuración',
        path: '/system-config',
        subItems: [
            {
                name: 'Roles y Permisos',
                path: '/system-config/roles',
                icon: 'users-gear',
            },
            {
                name: 'Tema y Colores',
                path: '/system-config/theme',
                icon: 'palette',
            },
        ],
    },
    {
        icon: <IconFA icon="sign-out" style="duotone" size="xl" />,
        name: 'Cerrar sesión',
        path: '/logout',
    },
];

const AdminSidebar: React.FC = () => {
    // Hooks
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
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
            return { type: menuType, index };
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
                            type="button"
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
                                <IconFA
                                    icon="chevron-down"
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
                                        ? subMenuHeight[`${menuType}-${index}`]
                                        : 0,
                            }}
                        >
                            <div className="ml-4 space-y-1">
                                {nav.subItems.map(subItem => (
                                    <Link
                                        key={subItem.path}
                                        href={subItem.path}
                                        className={cn(
                                            'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                            pathname === subItem.path
                                                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50',
                                        )}
                                    >
                                        <IconFA icon={subItem.icon} className="h-4 w-4" />
                                        {subItem.name}
                                        {subItem.pro && (
                                            <span className="ml-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-xs font-medium text-white">
                                                PRO
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
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
                        <div className="flex items-center">
                            <IconFA
                                icon="graduation-cap"
                                size="xl"
                                className="text-indigo-600 dark:text-indigo-400"
                            />
                            <h1 className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">
                                EduSync
                            </h1>
                        </div>
                    ) : (
                        <IconFA
                            icon="graduation-cap"
                            size="xl"
                            className="text-indigo-600 dark:text-indigo-400"
                        />
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
                                    <IconFA icon="ellipsis-h" />
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
                                    <IconFA icon="ellipsis-h" />
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
