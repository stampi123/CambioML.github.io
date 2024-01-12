import PageHero from "@/app/components/hero/PageHero";
import Container from "../../components/Container";
import SolutionsCard from "../../components/solutions/SolutionsCard";
import Section from "@/app/components/Section";

const Solutions = [
    {
        title: "Compliance Use Case 1",
        description: "Use uniflow for compliance.",
        url: "https://www.cambioml.com",
        image: ""
    },
]

const ComplianceSolutionsPage = () => {
    return (
        <div className="pb-10 w-full h-full">
            <PageHero title="Compliance" description="Automate your compliance process with AI raters" />
            <div className="flex flex-col items-center justify-center py-20">
                <Section title="Automate your compliance process with AI raters" paragraphs={["Leverage CambioML to automate compliance checking and streamline your model release."]} center />
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

export default ComplianceSolutionsPage;