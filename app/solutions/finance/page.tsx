import PageHero from "@/app/components/hero/PageHero";
import Container from "../../components/Container";
import SolutionsCard from "../../components/solutions/SolutionsCard";
import Section from "@/app/components/Section";

const Solutions = [
    {
        title: "10K Evaluator",
        description: "Use uniflow and pykoi to fine-tune a pretrained model from a Nike 10K PDF.",
        url: "https://github.com/CambioML/cambio-cookbook/blob/main/examples/10K_Evaluator/10K_PDF_Evaluator.ipynb",
        image: "/images/solutions/nike-10k.png"
    },
]

const FintechSolutionsPage = () => {
    return (
        <div className="pb-10 w-full h-full flex flex-col justify-center items-center">
            <PageHero title="Finance" description="Power your finance with AI" />
            <div className="flex flex-col items-center justify-center py-20">
                <Section title="Boost your revenue with your private LLMs" paragraphs={["Leverage CambioML's Confucia, our proprietary state-of-the-art finance and economics LLMs, to enhance your industry solutions. Confucia delivers deep financial insight, significantly improves market agility, and enhances portfolio performance. Build your private LLMs in a week instead of starting from scratch."]} center />
            </div>
            <Container>
                <div className="pt-10 flex items-center justify-center">
                    <div className="max-w-[1200px] w-full h-full">
                        <div
                            className="
                            mt-10
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-8
                            "
                        >
                            {Solutions.map((useCase, i) => (
                                <SolutionsCard
                                    key={useCase.title + i}
                                    title={useCase.title}
                                    description={useCase.description}
                                    image={useCase.image}
                                    url={useCase.url} />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default FintechSolutionsPage;