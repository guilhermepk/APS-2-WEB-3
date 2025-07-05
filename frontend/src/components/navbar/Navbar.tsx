'use client';

import NavbarItem from "./NavbarItem";
import { NavbarItemType } from "@/models/types/navbar-item.type";

export default function Navbar() {
    const navItems: Array<NavbarItemType> = [
        { name: 'Projetos', href: '/' },
        { name: 'Tarefas', href: '/tasks' },
        { name: 'Usuários', href: '/users' },
    ];

    return (
        <nav
            className={`
                absolute
                w-[200px]
                h-[100vh]
                border-r border-white
                bg-black
            `}
        >
            <div
                className={`
                    mt-[50px]
                    flex items-center justify-center gap-8 flex-col
                    w-full
                `}
            >
                {navItems.map((item, index) => (
                    <NavbarItem key={index} item={item} />
                ))}
            </div>
        </nav>
    );
}