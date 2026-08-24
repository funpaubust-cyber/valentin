import { Hero } from "@/components/modules/Hero";
import { Projects } from "@/components/modules/Projects";
import { ReviewsTicker } from "@/components/modules/ReviewsTicker";
import { WorkStages } from "@/components/modules/WorkStages";
import { BeforeAfter } from "@/components/modules/BeforeAfter";
import { ContactsMap } from "@/components/modules/ContactsMap";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Projects />
      <ReviewsTicker />
      <WorkStages />
      <BeforeAfter />
      <ContactsMap />
    </main>
  );
}
