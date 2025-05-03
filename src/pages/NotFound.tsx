import React from "react";
import Link from "next/link";
import Image from "next/image";
import PageNotFound from "../../public/404 Error Page not Found with people connecting a plug-pana.svg";
import Layout from "@/components/layout";
import { useRouter } from "next/router";

const NotFound: React.FC = () => {
  const router = useRouter(); // ✅ move it inside the component

  return (
    <Layout>
      <section className="flex flex-col items-center justify-center gap-12 h-full p-8 dark:bg-gray-50 dark:text-gray-800">
        <div className="w-full max-w-lg">
          <Image
            src={PageNotFound}
            alt="404 Not Found Illustration"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>
        <div className="max-w-md text-center">
          <p className="text-2xl font-semibold md:text-3xl">
            Sorry, we couldn't find this page.
          </p>
          <p className="mt-4 mb-8 dark:text-gray-600">
            But don’t worry, you can find plenty of other things on our homepage.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 font-semibold rounded bg-amber-400 dark:bg-violet-600 dark:text-gray-50"
          >
            Back to homepage
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
