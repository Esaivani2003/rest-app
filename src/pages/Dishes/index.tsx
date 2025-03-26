import PopupFilter from "@/components/popupfilter/popup-filter"

export default function FilterDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Health Products</h1>
        <PopupFilter />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample product cards */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <div className="bg-gray-200 rounded-md aspect-square mb-2"></div>
            <h3 className="font-medium">Product Name {i + 1}</h3>
            <p className="text-sm text-muted-foreground">
              {i % 2 === 0 ? "Diabetes" : i % 3 === 0 ? "Hypertension" : "Arthritis"}
            </p>
            <p className="font-semibold">${(i + 1) * 100}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

