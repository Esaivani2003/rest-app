import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/layout";
import { error } from "console";

const Index = () => {
  const router = useRouter();
  
  // to store the employee details
  const [NewEmployee,setNewEmployee] = useState([]);
  // Dummy employee data (Replace with API data)
  const employees = [
    { fullname: "John Doe", email: "john@example.com", phone: "123-456-7890", role: "Manager", doj: "2024-01-15" },
    { fullname: "Jane Smith", email: "jane@example.com", phone: "987-654-3210", role: "Chef", doj: "2023-11-10" },
  ];

  const fetchEmployees = async () => {

    const URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/usersRoute/users`
    try {
      const res = await fetch(URL);
      if (!res.ok) throw new Error("Failed to fetch employees");
      
      const data = await res.json();
      setNewEmployee(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  
  

  useEffect(()=>{
    if(NewEmployee.length === 0){
      fetchEmployees()
    }
  },[])

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
              {NewEmployee.map((emp:any, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{emp?.name}</td>
                  <td className="p-3">{emp?.email}</td>
                  <td className="p-3">{emp?.phone}</td>
                  <td className="p-3">{emp?.role}</td>
                  <td className="p-3">{emp?.createdAt}</td>
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
