import MenuForm from "@/components/menuform"; // Adjust path if needed

const MenuPage = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Add a New Menu Item</h1>
      <MenuForm />
    </div>
  );
};

export default MenuPage;
