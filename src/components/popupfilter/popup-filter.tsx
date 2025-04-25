import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter } from "lucide-react";

// Mock food items data
const allFoodItems = [
  { id: 1, name: "Hard taco, chicken", price: 2.5, relatedDiseases: ["diabetes", "hypertension"] },
  { id: 2, name: "Hard taco, beef", price: 2.75, relatedDiseases: ["arthritis"] },
  { id: 3, name: "Curly fries", price: 1.75, relatedDiseases: ["diabetes"] },
  { id: 4, name: "Large soda", price: 2.0, relatedDiseases: ["hypertension", "heart-disease"] },
];

export default function PopupFilter() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState(allFoodItems); // Initially show all items
  const [open, setOpen] = useState(false);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleDiseaseChange = (value: string) => {
    setSelectedDisease(value);
  };

  const applyFilters = () => {
    let filtered = allFoodItems;

    // Filter by selected disease
    if (selectedDisease) {
      filtered = filtered.filter(item => item.relatedDiseases.includes(selectedDisease));
    }

    // Filter by price range
    filtered = filtered.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

    setFilteredItems(filtered); // Update the filtered food items
    setOpen(false); // Close the dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Products</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Category</h4>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="supplements">Supplements</SelectItem>
                  <SelectItem value="equipment">Medical Equipment</SelectItem>
                  <SelectItem value="medications">Medications</SelectItem>
                  <SelectItem value="wellness">Wellness Products</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <h4 className="font-medium">Price Range</h4>
              <span className="text-sm text-muted-foreground">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 1000]}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Related Disease</h4>
            <Select onValueChange={handleDiseaseChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select disease" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Diseases</SelectLabel>
                  <SelectItem value="diabetes">Diabetes</SelectItem>
                  <SelectItem value="hypertension">Hypertension</SelectItem>
                  <SelectItem value="arthritis">Arthritis</SelectItem>
                  <SelectItem value="asthma">Asthma</SelectItem>
                  <SelectItem value="heart-disease">Heart Disease</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={applyFilters} className="w-full">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
