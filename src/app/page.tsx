import Header from "./_components/header";
import HiddenScroll from "./_components/hidden-scroll";
import Revealing from "./_components/revealing";
import BlogPreview from "./_sections/blog-preview";
import Intro from "./_sections/intro/intro";
import Outro from "./_sections/outro/outro";
import Projects from "./_sections/projects";
import WorkExperience from "./_sections/work-experience/work-experience";

export default function Home() {
  return (
    <>
      <HiddenScroll>
        <Header />
      </HiddenScroll>

      <div className="container mx-auto px-2 lg:px-4 xl:px-8 mb-6">
        <Revealing>
          <Intro />
        </Revealing>
        <Revealing>
          <BlogPreview />
        </Revealing>
        <Revealing>
          <Projects />
        </Revealing>
        <Revealing>
          <WorkExperience />
        </Revealing>
        <Revealing>
          <Outro />
        </Revealing>
      </div>
    </>
  );
}
