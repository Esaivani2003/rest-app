import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";

const EmployeePage = () => {
  const router = useRouter()
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: ""
  }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       const response:any = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/usersRoute/users`, employee);
       if (response.status === 201 || response.status === 200) {
        alert("Employee Added Successfully!");
        router.push("/Employee");
      } else {
        alert("Failed to Add Employee!");
      }
    } catch (err) {
      console.error("Error adding employee", err);
      alert("An error occurred while adding the employee.");
    }
  };

  return (
    <div className=" w-[90%] bg-amber-600">
      <Head>
        <title>Employee Registration</title>
      </Head>
      <div className="min-h-screen w-full  flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">Employee Registration</h2>
          <p className="text-gray-600 mt-2 text-center">Register a new employee in the system.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={employee.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={employee.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={employee.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              name="password"
              value={employee.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              name="role"
              value={employee.role}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Role</option>
              <option value="chef">Chef</option>
              <option value="waiter">Waiter</option>
              <option value="provider">Provider</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
