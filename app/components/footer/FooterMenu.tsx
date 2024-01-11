interface FooterMenuProps {
    title: string;
    links: {
        title: string;
        url: string;
    }[]
}

const FooterMenu: React.FC<FooterMenuProps> = ({
    title,
    links
}) => {
    return (
        <div className="flex flex-col gap-5">
            <div className="font-semibold text-md">{title.toUpperCase()}</div>
            <div className="flex flex-col gap-1">
                {links.map((link, i) => (
                    <a target="_blank" href={link.url} rel="noopener noreferrer" key={link.title + i}>
                        <div className="cursor-pointer hover:text-cambio-red text-md">{link.title}</div>
                    </a>
                ))}
            </div>
        </div>
    )
};

export default FooterMenu;