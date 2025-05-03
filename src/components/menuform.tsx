"use client";

import { useState,useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Addon {
  name: string;
  price: number;
}

interface FormData {
  name: string;
  category: string;
  price: number;
  discount: number;
  description: string;
  addons: Addon[];
  image: FileList;
  FoodCategory:string,
  FoodType:string
}

const categories = [
  "Vegetarian", "Non-Vegetarian", "Vegan", "Dessert",
  "Beverage", "Fast Food", "Main Course", "Breakfast",
  "Low Carb", "Sugar Free", "High Fiber", "Low Sodium", "Heart Healthy", "Low Fat"
];

// Convert image file to Base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const AddFoodPage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const [addons, setAddons] = useState<Addon[]>([]);
   const [diseaseSee, setSeeDisease] = useState<string[]>([]);

   useEffect(() => {
    const fetchDiseases = async () => {
      try {
        // if (disease.length === 0) return; // Check if there are diseases selected
  
        // Call recommendation API with the diseases array
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/diseases`);
  
        const data = await response.json();
        setSeeDisease(data.flatMap((disease: any) => disease.categories)); // Set the fetched products
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };
    if(diseaseSee.length === 0){
      fetchDiseases()
    }
    
    }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form Data before submission:", data);

    // Convert image to Base64
    const base64Image = await convertToBase64(data.image[0]);

    const formData = {
      name: data.name,
      category: data.category,
      price: data.price.toString(),
      discount: data.discount.toString(),
      description: data.description,
      image: base64Image, // Store Base64 in DB
      addons: JSON.stringify(addons),
      FoodCategory:data.FoodCategory,
      FoodType:data.FoodType
    };

    try {
      const response = await fetch("/api/foodRoute/fooditems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Item added successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the item.");
    }
  };

  const addAddon = () => {
    setAddons([...addons, { name: "", price: 0 }]);
  };

  const updateAddon = (index: number, field: keyof Addon, value: string | number) => {
    const updatedAddons = [...addons];
    updatedAddons[index] = { ...updatedAddons[index], [field]: value };
    setAddons(updatedAddons);
    setValue("addons", updatedAddons);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 border grid grid-cols-2 gap-x-6 sm:w-[50%] w-[90%] rounded-lg shadow-lg bg-white">
        <h2 className="col-span-2 text-2xl font-semibold text-center mb-4">Add New Food Item</h2>

        <div>
          <label className="block font-semibold">Name:</label>
          <input type="text" {...register("name", { required: true })} className="border p-2 rounded w-full" />
          {errors.name && <p className="text-red-500 text-xs">Name is required</p>}
        </div>

        <div>
          <label className="block font-semibold">FoodCategory:</label>
          <input type="text" {...register("FoodCategory", { required: true })} className="border p-2 rounded w-full" />
          {errors.FoodCategory && <p className="text-red-500 text-xs">FoodCategory is required</p>}
        </div>
        <div>
          <label className="block font-semibold">FoodType:</label>
          <input type="text" {...register("FoodType", { required: true })} className="border p-2 rounded w-full" />
          {errors.FoodType && <p className="text-red-500 text-xs">FoodType is required</p>}
        </div>

        <div>
          <label className="block font-semibold">Category:</label>
          <select {...register("category", { required: true })} className="border p-2 rounded w-full">
            {diseaseSee.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs">Category is required</p>}
        </div>

        <div>
          <label className="block font-semibold">Price:</label>
          <input type="number" {...register("price", { required: true, min: 0 })} className="border p-2 rounded w-full" />
          {errors.price && <p className="text-red-500 text-xs">Price is required</p>}
        </div>

        <div>
          <label className="block font-semibold">Discount:</label>
          <input type="number" {...register("discount", { required: true, min: 0, max: 100 })} className="border p-2 rounded w-full" />
          {errors.discount && <p className="text-red-500 text-xs">Discount must be between 0 and 100</p>}
        </div>

        <div>
          <label className="block font-semibold">Description:</label>
          <textarea {...register("description", { required: true })} className="border p-2 rounded w-full" />
          {errors.description && <p className="text-red-500 text-xs">Description is required</p>}
        </div>

        <div className="col-span-2">
          <label className="block font-semibold">Add-ons:</label>
          {addons.map((addon, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <input type="text" placeholder="Addon Name" value={addon.name} onChange={(e) => updateAddon(index, "name", e.target.value)} className="border p-2 rounded w-full" />
              <input type="number" placeholder="Addon Price" value={addon.price} onChange={(e) => updateAddon(index, "price", parseFloat(e.target.value))} className="border p-2 rounded w-1/3" />
            </div>
          ))}
          <button type="button" onClick={addAddon} className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">+ Add Addon</button>
        </div>

        <div>
          <label className="block font-semibold">Image:</label>
          <input type="file" {...register("image", { required: true })} className="border p-2 rounded w-full" />
          {errors.image && <p className="text-red-500 text-xs">Image is required</p>}
        </div>

        <button type="submit" className="col-span-2 bg-green-500 text-white p-7 rounded w-full hover:bg-green-600">Submit</button>
      </form>
    </div>
  );
};

export default AddFoodPage;
