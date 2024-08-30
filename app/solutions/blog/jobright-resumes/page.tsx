import Blog from '@/app/components/blog/Blog';
import BlogImage from '@/app/components/blog/BlogImage';
import BlogLink from '@/app/components/blog/BlogLink';
import BlogList from '@/app/components/blog/BlogListItem';
import BlogParagraph from '@/app/components/blog/BlogParagraph';
import BlogSectionTitle from '@/app/components/blog/BlogSectionTitle';

const KDDPage = () => {
  return (
    <Blog
      title="AnyParser: The Secret Weapon Behind JobRight.ai's Resume Extraction"
      writtenBy="Rachel Hu, CEO @ CambioML"
      publishedOn="August 30, 2024"
    >
      <BlogSectionTitle title="The Resume Rumble: JobRight.ai vs. The Parser Problem" />
      <BlogParagraph>
        Picture this: You&apos;re <BlogLink text="JobRight.ai" url="http://jobright.ai/" />, the No.1 AI job marketplace
        (ranked by OpenAI GPT Store) who can match dream jobs with dream candidates like it&apos;s going out of style.
        But there&apos;s a sneaky villain lurking in the shadows - the dreaded resume parser!
        <BlogLink text="JobRight.ai" url="http://jobright.ai/" /> knew they needed a parser with superpowers. They
        weren&apos;t settling for any old OCR relic from the digital stone age. Nope, they wanted a parser that could:
      </BlogParagraph>
      <BlogList
        items={[
          { content: 'Crack the code of resumes with laser-precision accuracy' },
          { content: 'Zoom through millions of docs faster than you can say "You\'re hired!"' },
        ]}
        ordered
      />
      <BlogParagraph>Enter AnyParser, the caped crusader of the parsing world!</BlogParagraph>
      <BlogSectionTitle title="AnyParser: The Hero JobRight.ai Deserves (and Needs!)" />
      <BlogParagraph>
        After a nail-biting showdown worthy of a Hollywood blockbuster,
        <BlogLink text="JobRight.ai" url="http://jobright.ai/" /> crowned AnyParser as their parsing champion. Why?
        Because AnyParser doesn&apos;t just parse - it performs parsing magic!
      </BlogParagraph>
      <BlogParagraph>
        Forget those clunky OCR models stumbling over tables and charts like a rookie waiter on roller skates. AnyParser
        is the smooth operator that glides through PDFs, Word docs, PowerPoints, and images, extracting info with the
        finesse of a digital sommelier.
      </BlogParagraph>
      <BlogParagraph>
        But don&apos;t just take our word for it! In the great Parser Olympics, AnyParser left the competition in the
        dust:
      </BlogParagraph>
      <BlogList
        items={[
          { content: 'Lowest edit distance? Check!' },
          { content: 'Highest BLEU score? Double-check!' },
          { content: "Making other parsers look like they're using carrier pigeons? Triple-check!" },
        ]}
      />
      <BlogImage
        src="jobright-resumes-metrics.png"
        alt="Bar chart showing that AnyParser has the lowest edit distance and highest bleu scre compare to other LLM and OCR models"
      />
      <BlogSectionTitle title="The JobRight.ai Glow-Up" />
      <BlogParagraph>
        Thanks to AnyParser&apos;s supercharged skills, <BlogLink text="JobRight.ai" url="http://jobright.ai/" />
        &nbsp; isn&apos;t just matching jobs - it&apos;s creating career love stories! Job seekers can now apply with
        the swipe of a finger, while employers get candidate info so accurate, it&apos;s like they&apos;ve known them
        for years.
      </BlogParagraph>
      <BlogParagraph>
        And for all you data security nerds out there (we see you, and we love you), rest easy! AnyParser keeps those
        precious personal deets locked up tighter than Fort Knox.
      </BlogParagraph>
      <BlogSectionTitle title="Ready to Join the Parsing Party?" />
      <BlogParagraph>
        Curious to see if AnyParser can sprinkle some magic on your document processing? Dip your toes in the water with
        a FREE trial! No credit card required! 🎉📄🚀
      </BlogParagraph>
      <BlogParagraph>
        Ready to turn your career dreams into reality? Dive into
        <BlogLink text="JobRight.ai" url="http://jobright.ai/" /> and discover your perfect job match today!
      </BlogParagraph>
    </Blog>
  );
};

export default KDDPage;
