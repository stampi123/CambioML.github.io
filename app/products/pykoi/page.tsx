import PageHero from "@/app/components/hero/PageHero";
import Container from "../../components/Container";
import Section from "@/app/components/Section";

const PykoiPage = () => {
    return (
        <>
            <PageHero title="🎏 pykoi" description="RLHF/RLAIF in one unified interface"/>
            <Container styles="h-max min-h-[80vh] py-20 max-w-[850px]">
                <Section title="pykoi supercharges your ability to finetune your models" description="pykoi is an open-source python library for improving LLMs with RLHF. We provide a unified interface including RLHF/RLAIF data and feedback collection, finetuning with reinforcement learning and reward modeling, and LLM comparisons." center/>
            </Container>
        </>
    )
}

export default PykoiPage;