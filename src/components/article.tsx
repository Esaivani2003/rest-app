"use client";
import Image from "next/image";

const ArticleCard = () => {
  return (
    <div className="p-5 mx-auto sm:p-10 md:px-16 dark:bg-gray-100 dark:text-gray-800">
      <div className="flex flex-col max-w-3xl mx-auto overflow-hidden rounded">
        {/* Article Image */}
        <div className="relative w-full mb-6 h-60 sm:h-60">
          <Image
            src="/banner.jpg"
            alt="Article Image"
            layout="fill"
            objectFit="cover"
            className="dark:bg-gray-500"
          />
        </div>

        {/* Article Content */}
        <div className="px-6 m-4 relative mx-auto  space-y-6 lg:max-w-2xl sm:px-10 sm:mx-12 lg:rounded-md dark:bg-gray-50 shadow-lg">
          <div className="space-y-2">
            <a
              rel="noopener noreferrer"
              href="#"
              className="inline-block text-2xl font-semibold sm:text-3xl hover:text-gray-500 transition"
            >
             🌿 Eating is a necessity, but cooking is an art.
            </a>
            <p className="text-xs dark:text-gray-600">
              {" "}
              <a
                rel="noopener noreferrer"
                href="#"
                className="text-xs hover:underline text-blue-600"
              >
                🔥 owner Nanthu
              </a>
            </p>
          </div>
          <div className="dark:text-gray-800">
            <p>🍷A restaurant is a fantasy—a kind of living fantasy in which diners are the most important members of the cast...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;