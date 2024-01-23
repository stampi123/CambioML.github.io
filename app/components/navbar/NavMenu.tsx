'use client';

import { useCallback, useState, useRef } from 'react';
import MenuItem from './MenuItem';
import { useRouter } from 'next/navigation';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface NavMenuProps {
    label: string;
    links: string[];
}


const NavMenu: React.FC<NavMenuProps> = ({ label, links }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const excludeRef = useRef<HTMLDivElement>(null);
    const ref = useOutsideClick(() => {
        toggleOpen();
    }, excludeRef);


    const makeOnClick = (label: string, link: string) => {
        const url = `/${label}/${link}`.toLowerCase().replaceAll(' ', '-');
        return () => {
            router.push(url);
            setIsOpen(false);
        };
    }

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, [])


    return (
        <div className="relative">
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    toggleOpen();
                }}
                className="
                    text-lg
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    hover:text-cambio-red
                    transition
                    cursor-pointer
                    "
                ref={excludeRef}
            >
                {label.toUpperCase()}
            </div>
            {isOpen && (
                <div
                    className="
            absolute
            rounded-xl
            shadow-md
            w-[150px]
            bg-white
            overflow-hidden
            right-0
            top-12
            text-sm
          "
                    ref={ref}
                >
                    <div className="flex flex-col cursor-pointer">
                        <>
                            {links.map((thisLink, i) => (
                                <MenuItem
                                    key={i + thisLink}
                                    onClick={makeOnClick(label, thisLink)}
                                    label={thisLink}
                                />)
                            )}
                        </>
                    </div>
                </div>
            )}
        </div>
    )
};

export default NavMenu;