import React from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";

const Index = () => {
  const router = useRouter();

  // Dummy employee data (Replace with API data)
  const employees = [
    { fullname: "John Doe", email: "john@example.com", phone: "123-456-7890", role: "Manager", doj: "2024-01-15" },
    { fullname: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", role: "Chef", doj: "2023-11-10" },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Employee List</h2>

        {/* Navigate to Add Employee Page */}
        <button
          onClick={() => router.push("/Employee/addemployee")}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
        >
          Add Employee
        </button>

        {/* Employee Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Date of Joining</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{emp.fullname}</td>
                  <td className="p-3">{emp.email}</td>
                  <td className="p-3">{emp.phone}</td>
                  <td className="p-3">{emp.role}</td>
                  <td className="p-3">{emp.doj}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
