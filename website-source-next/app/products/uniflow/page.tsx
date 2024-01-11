import PageHero from "@/app/components/hero/PageHero";
import Container from "../../components/Container";
import Section from "@/app/components/Section";

const UniflowPage = () => {
    return (
        <>
            <PageHero title="🌊 uniflow" description="A unified interface to solve the data augmentation platform for LLM training" />
            <Container styles="h-max min-h-[80vh] py-20 max-w-[850px]">
                <Section title="uniflow streamlines your data" description="uniflow is a unified interface to solve data augmentation problem for LLM training. It enables use of different LLMs, including OpenAI, Huggingface, and LMQG with a single interface. Using uniflow, you can easily run different LLMs to generate questions and answers, chunk text, summarize text, and more." center />
            </Container>
        </>
    )
}

export default UniflowPage;