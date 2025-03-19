"use client";
import ArticleCard from "@/components/article";
import Layout from "@/components/layout";


export default function Home() {
  return (
    <Layout>
    <main className="flex flex-col items-center justify-center min-h-screen px-5">
      <ArticleCard />
    </main>
    </Layout>
  );
}
