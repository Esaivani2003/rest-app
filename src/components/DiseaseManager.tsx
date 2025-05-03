"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type DiseaseType = {
  _id: string;
  disease: string;
  avoid: string[];
  recommended: string[];
  categories: string[];
};

export default function DiseaseManager() {
  const [diseases, setDiseases] = useState<DiseaseType[]>([]);
  const [form, setForm] = useState({
    disease: "",
    avoid: "",
    recommended: "",
    categories: "",
  });
  const [editingDisease, setEditingDisease] = useState<DiseaseType | null>(null);

  const fetchDiseases = async () => {
    const res = await fetch("/api/diseases");
    const data = await res.json();
    setDiseases(data);
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const handleSubmit = async () => {
    const body = {
      disease: form.disease,
      avoid: form.avoid.split(",").map((s) => s.trim()),
      recommended: form.recommended.split(",").map((s) => s.trim()),
      categories: form.categories.split(",").map((s) => s.trim()),
    };

    let res;
    if (editingDisease) {
      // PUT request for updating existing disease
      res = await fetch(`/api/diseases`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      // POST request for adding a new disease
      res = await fetch("/api/diseases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    if (res.ok) {
      toast.success(editingDisease ? "Disease updated" : "Disease saved");
      setForm({ disease: "", avoid: "", recommended: "", categories: "" });
      setEditingDisease(null);
      fetchDiseases();
    } else {
      toast.error("Failed to save");
    }
  };

  const deleteDisease = async (id: string) => {
    const res = await fetch(`/api/diseases/delete?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      fetchDiseases();
    } else {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (disease: DiseaseType) => {
    setForm({
      disease: disease.disease,
      avoid: disease.avoid.join(", "),
      recommended: disease.recommended.join(", "),
      categories: disease.categories.join(", "),
    });
    setEditingDisease(disease);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-gradient-to-r from-blue-600 to-blue-400 min-h-screen rounded-xl shadow-lg">
      <h2 className="text-4xl font-extrabold text-white text-center">Hotel Recommendations Manager</h2>

      <Card className="bg-white shadow-lg rounded-xl">
        <CardContent className="p-6 space-y-6">
          <Input
            placeholder="Disease name"
            value={form.disease}
            onChange={(e) => setForm({ ...form, disease: e.target.value })}
            className="bg-gradient-to-r from-gray-100 to-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Textarea
            placeholder="Avoid items (comma separated)"
            value={form.avoid}
            onChange={(e) => setForm({ ...form, avoid: e.target.value })}
            className="bg-gradient-to-r from-gray-100 to-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Textarea
            placeholder="Recommended items (comma separated)"
            value={form.recommended}
            onChange={(e) => setForm({ ...form, recommended: e.target.value })}
            className="bg-gradient-to-r from-gray-100 to-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Textarea
            placeholder="Categories (comma separated)"
            value={form.categories}
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
            className="bg-gradient-to-r from-gray-100 to-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700"
          >
            {editingDisease ? "Update Disease" : "Save Disease"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {diseases.map((disease) => (
          <Card key={disease._id} className="bg-white shadow-lg rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-blue-700">{disease.disease}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(disease)}
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteDisease(disease._id)}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-lg text-gray-600">Avoid: {disease.avoid.join(", ")}</p>
              <p className="text-lg text-gray-600">Recommended: {disease.recommended.join(", ")}</p>
              <p className="text-lg text-gray-600">Categories: {disease.categories.join(", ")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
