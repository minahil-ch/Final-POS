"use client";

import { useEffect, useState } from "react";
import { Building2, Edit, Trash2, FileDown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner"; // Optional: can remove if not using toast

interface Branch {
  id: string;
  name: string;
  location: string;
  created_at: string;
}

export default function AddBranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState<"name" | "date">("date");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
      toast.error("Failed to fetch branches.");
    } else {
      setBranches(data as Branch[]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !location.trim()) {
      toast.error("Please enter both name and location.");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("branches")
        .update({ name, location })
        .eq("id", editingId);

      if (error) {
        console.error("Update error:", error.message);
        toast.error("Failed to update branch.");
        return;
      }

      toast.success("Branch updated!");
      setEditingId(null);
    } else {
      const { error } = await supabase.from("branches").insert([
        {
          id: uuidv4(),
          name,
          location,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Insert error:", error.message);
        toast.error("Failed to add branch.");
        return;
      }

      toast.success("Branch added!");
    }

    setName("");
    setLocation("");
    fetchBranches();
  };

  const handleEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setName(branch.name);
    setLocation(branch.location);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;

    const { error } = await supabase.from("branches").delete().eq("id", id);
    if (error) {
      console.error("Delete error:", error.message);
      toast.error("Failed to delete.");
      return;
    }

    toast.success("Branch deleted.");
    fetchBranches();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Branch List", 14, 14);
    autoTable(doc, {
      startY: 20,
      head: [["Name", "Location", "Created At"]],
      body: filteredBranches.map((branch) => [
        branch.name,
        branch.location,
        new Date(branch.created_at).toLocaleString(),
      ]),
    });
    doc.save("branches.pdf");
  };

  const filteredBranches = branches
    .filter((branch) =>
      branch.name.toLowerCase().includes(search.toLowerCase()) ||
      branch.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "name") return a.name.localeCompare(b.name);
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  return (
    <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 p-4 rounded text-white shadow flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Building2 size={20} />
          {editingId ? "Edit Branch" : "Add Branch"}
        </h2>
        <button
          onClick={exportPDF}
          className="text-sm bg-white text-primary px-3 py-1 rounded font-medium shadow flex items-center gap-1 hover:bg-gray-100"
        >
          <FileDown size={14} /> Export PDF
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4 max-w-xl"
      >
        <div>
          <label className="block text-sm font-medium">Branch Name</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 text-sm border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Gulberg Branch"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 text-sm border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., MM Alam Road"
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          {editingId ? "Update Branch" : "Add Branch"}
          
        </button>
      </form>
      

      {/* Search & Sort */}
      <div className="mt-6 max-w-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search branches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 w-full md:w-1/2 border rounded text-sm"
        />
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as "name" | "date")}
          className="px-3 py-2 border rounded text-sm"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Branch List */}
      {filteredBranches.length > 0 ? (
        <ul className="mt-4 space-y-2 max-w-xl">
          {filteredBranches.map((branch) => (
            <li
              key={branch.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow text-sm flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{branch.name}</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">
                  {branch.location}
                </div>
                <div className="text-gray-400 text-xs italic">
                  Created: {new Date(branch.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(branch)} title="Edit">
                  <Edit size={16} className="text-blue-500" />
                </button>
                <button onClick={() => handleDelete(branch.id)} title="Delete">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 text-sm text-gray-500">No branches found.</div>
      )}
    </div>
  );
}
