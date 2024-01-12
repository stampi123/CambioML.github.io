import PageHero from "@/app/components/hero/PageHero";
import Container from "../../components/Container";
import Section from "@/app/components/Section";

const UniflowPage = () => {
    return (
        <>
            <PageHero title="🌊 uniflow" description="Flow your unstructured data to your private LLMs" />
            <Container styles="h-max min-h-[80vh] py-20 max-w-[850px]">
                <Section title="uniflow streamlines your data" paragraphs={["Are you an ML professional grappling with the challenge of extracting high-quality data from confidential and unstructured data such as PDFs and PPTs? Fine-tuning large language models (LLMs) often requires dealing with such complex data, which poses significant challenges in terms of data privacy, processing efficiency, and model accuracy.",
                "uniflow helps you quickly prepare LLM finetuning data, from your private and unstructured data including PDFs, HTMLs, PPTs, Images, etc. With uniflow, you can easily extract and chunk text, generate questions and answers, summarize text, etc. for preparing your private LLMs finetuning."]} center />
            </Container>
        </>
    )
}

export default UniflowPage;