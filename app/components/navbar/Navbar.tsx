'use client';

import Container from "../Container";
import Logo from "./Logo";
import NavMenu from "./NavMenu";
import NavMenuFull from "./NavMenuFull";
import { useRouter } from 'next/navigation';

const menuItems = [
    {
        label: 'Solutions',
        links: [
            'Finance',
            'Manufacturing',
            // 'Compliance',
        ]
    },
    {
        label: 'Company',
        links: [
            'About us',
        ]
    },
]

const Navbar = () => {
    const router = useRouter();


    const makeOnClick = (label: string, link: string, callback: () => void) => {
        const url = `/${label}/${link}`.toLowerCase().replaceAll(' ', '-');
        return () => {
            router.push(url);
            callback();
        };
    }

    return (
        <div className="fixed w-full bg-white z-50 shadow-sm">
            <div className="
        py-4
        border-b-[1px]
        ">
                <Container>
                    <div
                        className="
                    flex
                    flex-row
                    items-center
                    justify-between
                    gap-3
                    md: gap-0
                    "
                    >
                        <Logo />
                        <div className="hidden md:flex flex-row items-center gap-3">
                            {menuItems.map((item, i) => (
                                <NavMenu key={item.label + i} label={item.label} links={item.links} />
                            ))}
                        </div>
                        <div className="md:hidden">
                            <NavMenuFull menuItems={menuItems} makeOnClick={makeOnClick}/>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Navbar;