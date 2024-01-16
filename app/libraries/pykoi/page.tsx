'use client';
import PageHero from "@/app/components/hero/PageHero";
import Container from "../../components/Container";
import Section from "@/app/components/Section";
import { Tabs, Tab } from "@/app/components/Tabs";
import CodeBlock from "@/app/components/CodeBlock";
import FeatureImage from "@/app/components/feature/FeatureImage";
import DemoTab from "@/app/components/DemoTab";

const PykoiPage = () => {
    return (
        <>
            <PageHero title="🎏 pykoi" description="Let AI Finetune your Private LLMs" />
            <Container styles="h-max min-h-[80vh] py-20 max-w-[850px]">
                <Section title="pykoi supercharges your ability to finetune your models" paragraphs={["pykoi is an open-source python library to finetune LLMs with RLAIF. Pykoi provides a unified interface including RLHF/RLAIF data and feedback collection, finetuning with reinforcement learning and reward modeling, and LLM comparisons."]} center />
                <Section title="Sharable UI for Data & Feedback Collection" paragraphs={["Add a chatbot UI with (optional) feedback options to any LLM. The data and interactions will automatically be collected to a database. Currently, two feedback options are supported, vote and rank. Explore how users are using your chatbot, collect feedback, or feed the data directly into RLHF (see below)."]} center />
                <Tabs>
                    <Tab label="Chatbot UI">
                        <DemoTab code={`import pykoi as pk

# assume you have some model, endpoint, or api
# this can be openai, hugggingface, bedrock, claude, etc.
model = your_model

# give model chat ui with vote feedback
chatbot = pk.Chatbot(model, feedback="vote")
# Create sharable link to the application
app = pk.Application(share=True, username="", password="")
app.add_component(chatbot)
app.run()`}
                            image="/images/pykoi/feedback-chat.gif"
                            alt="Feedback Chatbot UI"
                        />
                    </Tab>
                    <Tab label="Usage UI">
                        <DemoTab
                            code={`import pykoi as pk

# assume you have some model, endpoint, or api
model = your_model

# add chatbot to model
chatbot = pk.Chatbot(model, feedback='vote')

# analyze chatbot usage & feedback
dashboard = pk.Dashboard(chatbot)

# Create sharable link to the application
app = pk.Application(share=True, username="", password="")
app.add_component(chatbot)
app.add_component(dashboard)
app.run()`}
                            image="/images/pykoi/feedback-dashboard.gif" alt="Feedback Dashboard UI"
                        />
                    </Tab>
                </Tabs>
                <Section title="Easily use RLHF on your own models" paragraphs={["Once you've collected enough data, running Reinforcement Learning with Human Feedback (RLHF) is just a few lines of python. Spin up Supervised Finetuning (SFT), Reward Finetuning, and Reinforcement Learning (RL) for an end-to-end RLHF solution. (In the future we will provide our own hosting to make the process even easier!)"]} center />
                <Tabs>
                    <Tab label="Supervised Finetuning">
                        <CodeBlock code={`import pykoi as pk

# get data from local database
qa_database = pk.QuestionAnswerDatabase()
my_data_pd = qa_database.retrieve_all_question_answers_as_pandas()

# run supervised finetuning
config = pk.RLHFConfig(base_model_path="meta-llama/Llama-2-7b-hf",
                          dataset_type="local_db")
rlhf_step1_sft = pk.SupervisedFinetuning(config)
rlhf_step1_sft.train_and_save("./models/rlhf_step1_sft")`} showLineNumbers />
                    </Tab>
                    <Tab label="Reward Finetuning">
                        <CodeBlock code={`import pykoi as pk

# get data from local database
qa_database = pk.QuestionAnswerDatabase()
my_data_pd = qa_database.retrieve_all_question_answers_as_pandas()

# run reward model finetuning
config = pk.RLHFConfig()
rlhf_step2_rft = pk.RewardFinetuning(config)
rlhf_step2_rft.train_and_save("./models/rlhf_step2_rw")`} showLineNumbers />
                    </Tab>
                    <Tab label="Reinforcement Learning">
                        <CodeBlock code={`import pykoi as pk

# use huggingface sft and reward model
config = pk.RLHFConfig(
   base_model_path="meta-llama/Llama-2-7b-hf",
   reward_model_path="goldmermaid/rlhf_reward_model",
   dataset_type="huggingface",
   dataset_name="goldmermaid/stack_exchange_rank_10k_dataset",
   dataset_subset_rl="data",
)

rlhf_step3_rl = pk.RLFinetuning(config)
rlhf_step3_rl.train_and_save("./models/rlhf_step3_rl")`} showLineNumbers />
                    </Tab>
                </Tabs>
                <Section title="LLM Comparisons" paragraphs={["Easily compare multiple models to each other. Rank the outputs relative to each other, and visualize the results."]} center />
                <Tabs>
                    <Tab label="Comparison UI">
                        <DemoTab
                            code={`import pykoi as pk

# assume you have some model, endpoint, or api
model_1 = your_first_model
model_2 = your_second_model
model_3 = your_third_model
model_4 = your_fourth_model

model_array = [
    model_1,
    model_2,
    model_3,
    model_4
]

# give interactive chat ui with feedback
chatbot = pk.Compare(models=model_array)

# Create sharable link to the application
app = pk.Application(share=False)
app.add_component(chatbot)
app.run()`}
                            image="/images/pykoi/comparison-chat.gif" alt="Comparison Chatbot UI"
                        />
                    </Tab>
                    <Tab label="Comparison Visual">
                        <DemoTab
                            code={`import pykoi as pk

# assume you have some model, endpoint, or api
model_1 = your_first_model
...
model_4 = your_fourth_model

model_array = [
  model_1,
  ...
  model_4
]

# add dashboard to chatbot
chatbot = pk.Compare(models=model_array)
dashboard = pk.Dashboard(chatbot)


# Create sharable link to the application
app = pk.Application(share=False)
app.add_component(dashboard)
app.run()`}
                            image="/images/pykoi/compare-rank.gif" alt="Comparison Rank UI"
                        />
                    </Tab>
                    <Tab label="Python Comparison">
                        <DemoTab
                            code={`# inside .py script or .ipynb file
import pykoi as pk

# assume you have some list of models, endpoints, etc,
model_array = [
    model_1,
    ...,
    model_4
]

# create array of questions
questions = [
    'Who is a kernel?',
    ...
]

# Run inference
comparisons = pykoi.Compare(models=model_array)
comparisons.inference(questions=questions)

# Visualize results
comparisons.visualize()
`}
                            image="/images/pykoi/pykoi-jupyter.png" alt="pykoi jupyter UI"
                        />
                    </Tab>
                </Tabs>
                <div className="pb-20"/>
            </Container>
        </>
    )
}

export default PykoiPage;