import Revealing from "./_components/revealing";
import Intro from "./_sections/intro/intro";
import Outro from "./_sections/outro/outro";
import WorkExperience from "./_sections/work-experience/work-experience";

export default function Home() {
  return (
    <>
      <main className="container mx-auto px-2 lg:px-4 xl:px-8 mb-6">
        <Revealing>
          <Intro />
        </Revealing>
        <Revealing>
          <WorkExperience />
        </Revealing>
        <Revealing>
          <Outro />
        </Revealing>
      </main>
    </>
  );
}
