// import Layout from "../components/layout";     // ✅ Import the Layout page
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
// import EmployeePage from "./employees";

export default function Home() {
  return (
    // <Layout> 
    <> 
      <Head>
        <title>Health-Based Restaurant</title>
        <meta name="description" content="A restaurant menu tailored to your health conditions." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center text-white p-6">
          <h1 className="text-5xl font-bold">Welcome to Healthy Eats</h1>
          <p className="mt-4 text-lg">Personalized meals based on your health needs</p>
          <Link href="/employee">
            <button className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-lg transition duration-300">
              Go to Employees
            </button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      {/* <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Why Choose Us?</h2>
          <p className="text-gray-600 mt-4">We provide customized meals based on your health conditions.</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-lg shadow-md">
              <Image src="/healthy-food.jpg" alt="Healthy Food" width={300} height={200} className="rounded-md" />
              <h3 className="text-xl font-semibold mt-4">Nutritious Meals</h3>
              <p className="text-gray-600">Designed by nutritionists for a balanced diet.</p>
            </div>

           
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Image src="/personalized.jpg" alt="Personalized Meals" width={300} height={200} className="rounded-md" />
              <h3 className="text-xl font-semibold mt-4">Personalized Diet</h3>
              <p className="text-gray-600">Meals based on your health conditions (Sugar, BP, etc.).</p>
            </div>

           
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Image src="/organic.jpg" alt="Organic Ingredients" width={300} height={200} className="rounded-md" />
              <h3 className="text-xl font-semibold mt-4">Organic Ingredients</h3>
              <p className="text-gray-600">Fresh and organic ingredients for a healthy lifestyle.</p>
            </div>

          </div>
        </div>
      </section> */}
      
      {/* <EmployeePage /> */}
    {/* // </Layout>   */}
    </> 
  );
}
