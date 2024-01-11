import PageHero from "@/app/components/hero/PageHero";
import Container from "../../components/Container";
import SolutionsCard from "../../components/solutions/SolutionsCard";

const Solutions = [
    {
        title: "Manufacturing Use Case 1",
        description: "Use uniflow and pykoi to manufacture.",
        url: "https://www.cambioml.com",
        image: ""
    },
]

const SolutionsPage = () => {
    return (
        <div className="pb-10 w-full h-full">
            <PageHero title="Manufacturing" description="Streamline your processes with AI" />
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