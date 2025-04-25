"use client";
import ArticleCard from "@/components/article";
import Layout from "@/components/layout";
import UserMenuPage from "@/components/userMenuPage"; // Rename import with capital

export default function Home() {
  return (
    <Layout>
      <main className="flex flex-col relative items-center justify-center min-h-screen px-5">
        <ArticleCard />
        <UserMenuPage /> {/* Capitalized component usage */}
      </main>
    </Layout>
  );
}
