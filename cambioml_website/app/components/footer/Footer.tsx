import Container from "../Container";
import Logo from "../navbar/Logo";
import FooterMenu from "./FooterMenu";
import SocialButton from "./SocialButton";

const socialLinks = [
    {
        image: "/images/social/linkedin.png",
        url: "https://www.linkedin.com/company/cambioml/about/",
    }
];


const Footer = () => {
    return (
        <Container styles="h-[525px] md:h-[475px] lg:h-[425px] xl:h-[375px]" bgcolor="bg-cambio-blue">
            <div className="py-10 h-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-2 md:gap-5">
                <div className="flex flex-col gap-3 md:gap-5">
                    <Logo small/>
                    <div className="font-semibold text-md">Who is CambioML?</div>
                    <div><span className="font-semibold text-sm">cambioML</span> is a team of former scientists from AWS AI building SaaS solutions enable Fortune 500 companies to build self-owned AI agents based on their massive, multi-modal and confidential data. We’re building what we wish we had when developing foundation models at Amazon.</div>
                    {socialLinks.map((socialLink) => (
                        <SocialButton key={socialLink.url} image={socialLink.image} url={socialLink.url} />
                    ))}
                    <div className="text-sm text-neutral-500">© {(new Date().getFullYear())} Cambio Corp </div>
                </div>
                <FooterMenu title="Products" links={[
                    {
                        title: "uniflow",
                        url: "/products/uniflow",
                    },
                    {
                        title: "pykoi",
                        url: "/products/pykoi",
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