import { NavbarItemType } from "@/common/models/types/navbar-item.type";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarItemProps {
    item: NavbarItemType
}

export default function NavbarItem({
    item
}: NavbarItemProps) {
    const pathname = usePathname();

    return (
        <Link
            href={item.href}
            className={`
                flex justify-center items-center
                w-full
                ${pathname == item.href ? `bg-white text-black` : ``}
            `}
        >
            <p> {item.name} </p>
        </Link>
    );
}