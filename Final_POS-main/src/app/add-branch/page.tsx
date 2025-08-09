"use client";

import { useEffect, useState } from "react";
import { Building2, Edit, Trash2, FileDown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import supabase from '@/lib/supabaseClient';


import { toast } from "sonner";
import { PrismaClient } from "@prisma/client";


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
      console.error("Error fetching branches:", error.message);
      toast.error("Failed to fetch branches.");
    } else {
      setBranches(data as Branch[]);
    }
  };

  const resetForm = () => {
    setName("");
    setLocation("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !location.trim()) {
      toast.error("Please fill out both fields.");
      return;
    }

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim() || !location.trim()) {
    toast.error("Please fill out both fields.");
    return;
  }

  if (editingId) {
    // Keep this part if you're still using Supabase for updates
    const { error } = await supabase
      .from("branches")
      .update({ name, location })
      .eq("id", editingId);

    if (error) {
      toast.error("Error updating branch.");
      return;
    }

    toast.success("Branch updated!");
  } else {
    // 🆕 New: Call Prisma API Route instead of Supabase directly
    const response = await fetch("/api/branches/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      toast.error("Error adding branch.");
      return;
    }

    toast.success("Branch added!");
  }

  resetForm();
  fetchBranches(); // This is still using Supabase (for now)
};


    if (editingId) {
      const { error } = await supabase
        .from("branches")
        .update({ name, location })
        .eq("id", editingId);

      if (error) {
        toast.error("Error updating branch.");
        return;
      }

      toast.success("Branch updated!");
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
        toast.error("Error adding branch.");
        return;
      }

      toast.success("Branch added!");
    }

    resetForm();
    fetchBranches();
  };

  const handleEdit = (branch: Branch) => {
    setEditingId(branch.id);
    setName(branch.name);
    setLocation(branch.location);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this branch?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("branches").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete branch.");
    } else {
      toast.success("Branch deleted.");
      fetchBranches();
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Branches Report", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["Branch Name", "Location", "Created At"]],
      body: filteredBranches.map((branch) => [
        branch.name,
        branch.location,
        new Date(branch.created_at).toLocaleString(),
      ]),
    });
    doc.save("branches.pdf");
  };

  const filteredBranches = branches
    .filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortType === "name"
        ? a.name.localeCompare(b.name)
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-700 from-primary to-black p-4 rounded text-white shadow">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Building2 size={20} />
          {editingId ? "Edit Branch" : "Add Branch"}
        </h2>
        <button
          onClick={exportPDF}
          className="bg-white text-primary px-3 py-1 rounded shadow hover:bg-gray-100 text-sm flex items-center gap-1"
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
            placeholder="e.g., DHA Branch"
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
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-black from-primary [#DCD0FF] hover:opacity-90 text-white px-4 py-2 rounded text-sm font-semibold"
          >
            {editingId ? "Update" : "Add Branch"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
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
      <ul className="mt-4 space-y-2 max-w-xl">
        {filteredBranches.length > 0 ? (
          filteredBranches.map((branch) => (
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
          ))
        ) : (
          <div className="mt-6 text-sm text-gray-500">No branches found.</div>
        )}
      </ul>
    </div>
  );
}
