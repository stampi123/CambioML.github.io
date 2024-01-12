import PageHero from "@/app/components/hero/PageHero";
import Container from "../../components/Container";
import SolutionsCard from "../../components/solutions/SolutionsCard";
import Section from "@/app/components/Section";

const Solutions = [
    {
        title: "Manufacturing Use Case 1",
        description: "Use uniflow and pykoi to manufacture.",
        url: "https://www.cambioml.com",
        image: ""
    },
]

const ManufacturingSolutionsPage = () => {
    return (
        <div className="pb-10 w-full h-full">
            <PageHero title="Manufacturing" description="Boost your revenue with your private LLMs" />
            <div className="flex flex-col items-center justify-center py-20 gap-10">
                <Section title="FabDesign" paragraphs={["Seamlessly generate optimized designs, efficient processes, and advanced simulations via simple prompts. Revolutionize your manufacturing workflow and unlock limitless potential with Production Prodigy's intuitive AI-driven capabilities."]} center />
                <Section title="FabSearch" paragraphs={["Records any file you've seen, said, or heard and makes it searchable. For your privacy, we store all of the recordings locally on your Mac."]} center />
                <Section title="FabAnalytics" paragraphs={["Say goodbye to data silos and unlock actionable insights for optimized operations and enhanced decision-making. Streamline your data flow and revolutionize your manufacturing processes with FabAnalytics today."]} center />
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

export default ManufacturingSolutionsPage;