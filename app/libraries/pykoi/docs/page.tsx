'use client';
import PageHero from "@/app/components/hero/PageHero";
import Container from "@/app/components/Container";
import Section from "@/app/components/Section";
import { useRouter } from "next/navigation";

const PykoiDocsPage = () => {
    const router = useRouter();
    return (
        <>
            <PageHero title="🎏 pykoi Docs" description="Documentation"/>
            <Container styles="h-max min-h-[50vh] py-20 max-w-[850px]">
                <Section title="Docs" paragraphs={["Coming Soon!"]} center />
            </Container>
        </>
    )
}

export default PykoiDocsPage;