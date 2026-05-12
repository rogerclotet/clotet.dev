import Header from "./_components/header";
import HiddenScroll from "./_components/hidden-scroll";
import SideNav from "./_components/side-nav";
import BlogPreview from "./_sections/blog-preview";
import Intro from "./_sections/intro/intro";
import Outro from "./_sections/outro/outro";
import Projects from "./_sections/projects/projects";
import WorkExperience from "./_sections/work-experience/work-experience";

export default function Home() {
  return (
    <>
      <HiddenScroll>
        <Header />
      </HiddenScroll>

      <SideNav />

      <div className="container mx-auto px-2 lg:pl-16 lg:pr-6 xl:pl-20 xl:pr-8 lg:mb-6">
        <div id="intro">
          <Intro />
        </div>
        {/* <BlogPreview /> */}
        <div id="projects">
          <Projects />
        </div>
        <div id="work-experience">
          <WorkExperience />
        </div>
        <div id="outro">
          <Outro />
        </div>
      </div>
    </>
  );
}
