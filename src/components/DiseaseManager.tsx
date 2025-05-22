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
      res = await fetch(`/api/diseases`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
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
    <div className="p-6 bg-gradient-to-br from-pink-100 via-purple-200 to-white">
      <h2 className="text-4xl font-extrabold text-center text-pink-700 mb-8">
        Hotel Recommendations Manager
      </h2>

      <div className="grid gap-8 lg:grid-cols-2 max-w-7xl mx-auto items-start">
        {/* Form Section */}
        <Card className="bg-white shadow-xl rounded-xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-pink-600">
              {editingDisease ? "Edit Disease" : "Add New Disease"}
            </h3>
            <Input
              placeholder="Disease name"
              value={form.disease}
              onChange={(e) => setForm({ ...form, disease: e.target.value })}
            />
            <Textarea
              placeholder="Avoid items (comma separated)"
              value={form.avoid}
              onChange={(e) => setForm({ ...form, avoid: e.target.value })}
            />
            <Textarea
              placeholder="Recommended items (comma separated)"
              value={form.recommended}
              onChange={(e) => setForm({ ...form, recommended: e.target.value })}
            />
            <Textarea
              placeholder="Categories (comma separated)"
              value={form.categories}
              onChange={(e) => setForm({ ...form, categories: e.target.value })}
            />
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-6 py-2 rounded"
              >
                {editingDisease ? "Update Disease" : "Save Disease"}
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* Disease List Section */}
        <div className="space-y-6">
          {diseases.map((disease) => (
            <Card
              key={disease._id}
              className="bg-white shadow-lg rounded-xl border border-pink-200"
            >
              <CardContent className="p-6 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-pink-700">{disease.disease}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(disease)}
                      className="text-pink-600 border-pink-400 hover:bg-pink-50"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteDisease(disease._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p>
                  <strong>Avoid:</strong> {disease.avoid.join(", ")}
                </p>
                <p>
                  <strong>Recommended:</strong> {disease.recommended.join(", ")}
                </p>
                <p>
                  <strong>Categories:</strong> {disease.categories.join(", ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
