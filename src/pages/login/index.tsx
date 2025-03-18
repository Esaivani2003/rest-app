import Head from "next/head";

import AuthForm from "@/components/login";

export default function Home() {
  return (
    <>
      <Head>
        <title>Health-Based Restaurant</title>
        <meta name="description" content="A restaurant menu tailored to your health conditions." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col justify-center items-center min-h-screen right-3 bg-gray-100 dark:bg-gray-900 space-y-6">
    
        <AuthForm /> 
      </div>
    </>
  );
}

