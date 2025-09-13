import { Layout } from "@/components/layout";
import {
  Hero,
  PlatformsSection,
  ContentSection,
  SubmitSection,
} from "@/components/sections";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <PlatformsSection />
      <ContentSection />
      <SubmitSection />
    </Layout>
  );
}
