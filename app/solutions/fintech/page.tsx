import PageHero from "@/app/components/hero/PageHero";
import Container from "../../components/Container";
import SolutionsCard from "../../components/solutions/SolutionsCard";

const Solutions = [
    {
        title: "10K Evaluator",
        description: "Use uniflow and pykoi to fine-tune a pretrained model from a Nike 10K PDF.",
        url: "https://github.com/CambioML/cambio-cookbook/blob/main/examples/10K_Evaluator/10K_PDF_Evaluator.ipynb",
        image: "/images/solutions/nike-10k.png"
    },
]

const SolutionsPage = () => {
    return (
        <div className="pb-10 w-full h-full">
            <PageHero title="Fintech" description="Power your finance with AI" />
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
                            {Solutions.map((useCase) => (
                                <SolutionsCard title={useCase.title}
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

export default SolutionsPage;