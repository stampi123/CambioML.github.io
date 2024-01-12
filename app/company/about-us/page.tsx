'use client';

import PageHero from "@/app/components/hero/PageHero";
import Button from "../../components/Button";
import Container from "../../components/Container";
import Section from "@/app/components/Section";
import { imgPrefix } from "@/app/hooks/useImgPrefix";
import Heading from "@/app/components/Heading";

const sections = [
    {
        title: "Who we are",
        paragraphs: ["cambioML is a team of former scientists from AWS AI building SaaS solutions enable Fortune 500 companies to build self-owned AI agents based on their massive, multi-modal and confidential data. We’re building what we wish we had when developing foundation models at Amazon."],
    },
    {
        title: "What we offer",
        paragraphs: ["We offer a suite of products that enable you to build your own AI agents based on your massive, multi-modal and confidential data. Our products are built on top of our open-source libraries, uniflow and pykoi."],
    },
]

const investors = [
    {
        image: "/images/investors/ycombinator.png",
        alt: "Y Combinator",
        url: "https://www.ycombinator.com/companies/cambioml",
    },
    {
        image: "/images/investors/general-catalyst.png",
        alt: "General Catalyst",
        url: "https://www.generalcatalyst.com/",
    },
    {
        image: "/images/investors/samsung-next.png",
        alt: "Samsung Next",
        url: "https://www.samsungnext.com/",
        height: "h-[50px]",
    },
    {
        image: "/images/investors/zvc.png",
        alt: "Z Venture Capital",
        url: "https://zvc.vc/en/",
        height: "h-[65px]",
    }
]

const AboutPage = () => {
    return (
        <div className="pb-10">
            <PageHero title="About us" />
            <Container styles="h-max" centerX center-y>
                {sections.map((section) => (
                    <div className="pt-40 max-w-[800px]">
                        <Section title={section.title} paragraphs={section.paragraphs || [""]} center />
                    </div>
                ))}
                <div className="py-20">
                    <Heading title="Founding Team" center />
                    <div className="pt-5 flex flex-row justify-center items-center w-full">
                        <div className="grid gap-10 grid-cols-[300px_1fr]">
                            <div className="w-full flex justify-end items-center">
                                <div className="w-[150px] h-[150px]">
                                    <img
                                        src={imgPrefix + "/images/team/rachel.png"}
                                        alt="Rachel Hu, CEO"
                                        className="cursor-pointer max-h-full max-w-full rounded-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold">Rachel Hu</h2>
                                <h2 className="text-lg font-semibold">CEO</h2>
                                <p>Former AWS Scientist who</p>
                            </div>
                        </div>
                        <div className="grid gap-10 grid-cols-[300px_1fr]">
                            <div className="w-full flex justify-end items-center">
                                <div className="w-[150px] h-[150px]">
                                    <img
                                        src={imgPrefix + "/images/team/jojo.png"}
                                        alt="Jojo Ortiz, Founding Engineer"
                                        className="cursor-pointer max-h-full max-w-full rounded-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold">Jojo Ortiz</h2>
                                <h2 className="text-lg font-semibold">Founding Engineer</h2>
                                <p>Former Tesla Engineer who</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Heading title="Our Investors" center />
                <div className="pt-5 flex gap-8 max-w-800 align-items justify-items h-[100px] w-max">
                    {
                        investors.map((investor, i) => (
                            <a target="_blank" href={investor.url} rel="noopener noreferrer" key={investor.url + i}>
                                <div className={`flex items-center justify-center h-full w-max`}>
                                    <div className={`${investor.height || 'h-[100px]'} w-auto`}>
                                        <img
                                            src={imgPrefix + investor.image}
                                            alt={investor.alt}
                                            className={`cursor-pointer max-h-full max-w-full`}
                                        />
                                    </div>
                                </div>
                            </a>
                        ))
                    }
                </div>
                <div className="flex items-center align-center w-[500px] gap-5 mt-20">
                    <Button label="Get Started" onClick={() => { console.log('get started') }} />
                    <Button label="Read the documentation" onClick={() => { console.log('read') }} outline />
                </div>
            </Container>
        </div>
    )
}

export default AboutPage;