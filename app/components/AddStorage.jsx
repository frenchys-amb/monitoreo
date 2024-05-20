'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

export default function Inventory() {
  const supabase = createClient();
  const [formData, setFormData] = useState({ name: "", amount: "" });
  const [storageData, setStorageData] = useState([]);

  async function fetchStorageData() {
    try {
      const { data, error } = await supabase.from("storage").select("*");

      if (error) {
        throw error;
      }

      if (data) {
        setStorageData(data);
      }
    } catch (error) {
      console.error(error);
      alert("Error loading storage data!");
    }
  }

  useEffect(() => {
    fetchStorageData();
  }, []); // Ejecutar solo una vez al montar el componente

  async function addItem() {
    try {
      const { error: insertError } = await supabase
        .from("storage")
        .insert([formData]);

      if (insertError) {
        throw insertError;
      }

      // Reset form data
      setFormData({ name: "", amount: "" });

      // Refrescar los datos del almacenamiento
      fetchStorageData();
    } catch (error) {
      alert("Error adding item!");
    }
  }

  async function updateItem() {
    try {
      const { name, amount } = formData;
      
      console.log("Updating item:", formData); 

      const { data: existingStorage, error: searchError } = await supabase
        .from("storage")
        .select("*")
        .eq("name", name)
        .single();

      if (searchError) {
        throw searchError;
      }

      if (!existingStorage) {
        throw new Error("Storage not found!");
      }

      const currentAmount = existingStorage.amount || 0;

      console.log("Current amount:", currentAmount);

      const updatedAmount = parseInt(currentAmount) + parseInt(amount);

      const { error: updateError } = await supabase
        .from("storage")
        .update({ amount: updatedAmount.toString(), name })
        .eq("name", name);

      if (updateError) {
        throw updateError;
      }

      fetchStorageData();
    } catch (error) {
      console.error("Error updating item:", error); 
      alert("Error updating item!");
    }
  }

  async function deleteItem() {
    try {
      const { name } = formData;

      const { error: deleteError } = await supabase
        .from("storage")
        .delete()
        .eq("name", name);

      if (deleteError) {
        throw deleteError;
      }

      fetchStorageData();
    } catch (error) {
      alert("Error deleting item!");
    }
  }

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="w-full max-w-lg p-4 bg-gray-700 bg-opacity-75 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Storage</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mb-4 text-black">
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter item name"
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>
          <div className="mb-4 text-black">
            <input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
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
