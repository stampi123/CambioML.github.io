import Container from "../Container";
import Logo from "../navbar/Logo";
import FooterMenu from "./FooterMenu";
import SocialButton from "./SocialButton";

const socialLinks = [
    {
        image: "/images/social/linkedin.png",
        url: "https://www.linkedin.com/company/cambioml/about/",
    },
    {
        image: "/images/social/ycombinator-social.png",
        url: "https://www.ycombinator.com/companies/cambioml",
    },
    {
        image: "/images/social/slack.png",
        url: "https://join.slack.com/t/cambiomlworkspace/shared_invite/zt-1zes33rmt-20Rag043uvExUaUdvt5_xQ",
    },
    {
        image: "/images/social/twitter.png",
        url: "https://twitter.com/cambioml",
    },
];


const Footer = () => {
    return (
        <Container styles="h-[525px] md:h-[475px] lg:h-[425px] xl:h-[375px]" bgcolor="bg-cambio-blue">
            <div className="py-10 h-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 md:gap-5">
                <div className="flex flex-col gap-3 md:gap-5">
                    <Logo small />
                    <div className="font-semibold text-md">CambioML: Private LLMs to Boost Enterprises</div>
                    <div className="flex gap-3">
                        {socialLinks.map((socialLink) => (
                            <SocialButton key={socialLink.url} image={socialLink.image} url={socialLink.url} />
                        ))}
                    </div>
                    <div className="text-sm text-neutral-500">© {(new Date().getFullYear())} Cambio Corp </div>
                </div>
                <FooterMenu title="Libraries" links={[
                    {
                        title: "uniflow",
                        url: "/libraries/uniflow",
                    },
                    {
                        title: "pykoi",
                        url: "/libraries/pykoi",
                    },
                ]} />
                <FooterMenu title="Support" links={[
                    {
                        title: "Documentation",
                        url: "https://www.cambioml.com",
                    },
                ]} />
                <FooterMenu title="Resources" links={[
                    {
                        title: "Blog",
                        url: "https://www.cambioml.com",
                    },
                ]} />
                <FooterMenu title="Company" links={[
                    {
                        title: "About us",
                        url: "/about/about-us",
                    },
                ]} />
            </div>
        </Container >
    )
}

export default Footer;