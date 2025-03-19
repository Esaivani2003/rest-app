"use client";

import { useState } from "react";
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
}

const categories = ["Electronics", "Clothing", "Furniture", "Books", "Toys"];

const FormComponent = () => {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const [addons, setAddons] = useState<Addon[]>([]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form Data:", data);
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
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 border grid grid-cols-2 gap-x-6 sm:w-[50%] w-[90%]  rounded-lg shadow-lg bg-white mx-auto">
      {/* Name */}
      <div>
        <label className="block font-semibold">Name:</label>
        <input type="text" {...register("name")} className="border p-2 rounded w-full focus:ring focus:ring-blue-300" />
      </div>

      {/* Category Dropdown */}
      <div>
        <label className="block font-semibold">Category:</label>
        <select {...register("category")} className="border p-2 rounded w-full focus:ring focus:ring-blue-300">
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block font-semibold">Price:</label>
        <input type="number" {...register("price")} className="border p-2 rounded w-full focus:ring focus:ring-blue-300" />
      </div>

      {/* Discount */}
      <div>
        <label className="block font-semibold">Discount:</label>
        <input type="number" {...register("discount")} className="border p-2 rounded w-full focus:ring focus:ring-blue-300" />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold">Description:</label>
        <textarea {...register("description")} className="border p-2 rounded w-full focus:ring focus:ring-blue-300" />
      </div>

      {/* Addons Section */}
      <div>
        <label className="block font-semibold">Add-ons:</label>
        {addons.map((addon, index) => (
          <div key={index} className="flex space-x-2 mt-2">
            <input
              type="text"
              placeholder="Addon Name"
              value={addon.name}
              onChange={(e) => updateAddon(index, "name", e.target.value)}
              className="border p-2 rounded w-full focus:ring focus:ring-blue-300"
            />
            <input
              type="number"
              placeholder="Addon Price"
              value={addon.price}
              onChange={(e) => updateAddon(index, "price", parseFloat(e.target.value))}
              className="border p-2 rounded w-1/3 focus:ring focus:ring-blue-300"
            />
          </div>
        ))}
        <button type="button" onClick={addAddon} className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">+ Add Addon</button>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-semibold">Image:</label>
        <input type="file" {...register("image")} className="border p-2 rounded w-full focus:ring focus:ring-blue-300" />
      </div>

      {/* Submit Button */}
      <button type="submit" className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-600">Submit</button>
    </form>
  );
};

export default FormComponent;
