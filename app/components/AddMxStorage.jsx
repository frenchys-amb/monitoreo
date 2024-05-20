'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

export default function Inventory() {
  const supabase = createClient();
  const [formData, setFormData] = useState({ name: "", dose: "", amount: "" });
  const [medicationData, setMedicationData] = useState([]);

  useEffect(() => {
    fetchMedicationData();
  }, []);

  async function fetchMedicationData() {
    try {
      const { data, error } = await supabase.from("medication").select("*");
      if (error) throw error;
      setMedicationData(data);
    } catch (error) {
      console.error("Error loading medication data:", error);
      alert("Error loading medication data!");
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  async function addItem() {
    const { name, dose, amount } = formData;

    if (!name || !dose || !amount) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const { error } = await supabase.from("medication").insert([formData]);
      if (error) throw error;

      setFormData({ name: "", dose: "", amount: "" });
      fetchMedicationData();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item!");
    }
  }

  async function updateItem() {
    const { name, dose, amount } = formData;

    if (!name || !dose || !amount) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const { data: existingMedication, error: searchError } = await supabase
        .from("medication")
        .select("*")
        .eq("name", name)
        .single();

      if (searchError) throw searchError;
      if (!existingMedication) throw new Error("Medication not found!");

      const currentAmount = existingMedication.amount || 0;
      const updatedAmount = parseInt(currentAmount) + parseInt(amount);

      const { error: updateError } = await supabase
        .from("medication")
        .update({ amount: updatedAmount.toString(), dose })
        .eq("name", name);

      if (updateError) throw updateError;

      setFormData({ name: "", dose: "", amount: "" });
      fetchMedicationData();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item!");
    }
  }

  async function deleteItem() {
    const { name } = formData;

    if (!name) {
      alert("Please enter the medication name to delete!");
      return;
    }

    try {
      const { error } = await supabase.from("medication").delete().eq("name", name);
      if (error) throw error;

      setFormData({ name: "", dose: "", amount: "" });
      fetchMedicationData();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item!");
    }
  }

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="w-full max-w-lg p-4 bg-gray-700 bg-opacity-75 rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl font-bold text-white mb-4">Medication</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4 text-black">
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter item name"
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="mb-4 text-black">
            <input
              id="dose"
              type="text"
              value={formData.dose}
              onChange={handleInputChange}
              placeholder="Enter item dose"
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="mb-4 text-black">
            <input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter item amount"
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600 mr-2"
              onClick={addItem}
            >
              Add
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 mr-2"
              onClick={updateItem}
            >
              Update
            </button>
            <button
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:bg-red-600"
              onClick={deleteItem}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

