// "use client";
// import ArticleCard from "@/components/article";
// import Layout from "@/components/layout";
// import UserMenuPage from "@/components/userMenuPage"; // Rename import with capital

// export default function Home() {
//   return (
//     // <Layout>
//       <main className="flex flex-col relative items-center justify-center min-h-screen px-5">
//         {/* <ArticleCard />
//         <UserMenuPage /> */}

        
//       </main>
//     // </Layout>
//   );
// }


import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("login"); // redirects to /login
  }, [router]);

  return null; // Nothing to show on /
}
