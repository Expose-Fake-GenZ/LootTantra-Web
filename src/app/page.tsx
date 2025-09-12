import { Layout } from "@/components/layout";
import {
  Hero,
  PlatformsSection,
  ContentSection,
  SubmitSection,
} from "@/components/sections";
import ThemeTest from "@/components/ui/ThemeTest";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <PlatformsSection />
      <ContentSection />
      <SubmitSection />
      {/* <ThemeTest /> */}
    </Layout>
  );
}
