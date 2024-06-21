'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

export default function Inventory() {
  const supabase = createClient();
  const [formData, setFormData] = useState({ name: "",dose: "", amount: "" });
  const [medicationData, setMedicationData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({ name: "", dose: "", amount: "" });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchMedicationData() {
    try {
      const { data, error } = await supabase.from("unit15").select("*");

      if (error) {
        throw error;
      }

      if (data) {
        // Update states with fetched data
        setMedicationData(data);
        const recent = data.slice(-3).reverse(); // Get last 3 entries and reverse order
        setRecentItems(recent);
        setFilteredData(recent); // Initially show the last 3 entries
      }
    } catch (error) {
      console.error(error);
      alert("Error loading storage data!");
    }
  }

  // Effect to fetch medication data on component mount
  useEffect(() => {
    fetchMedicationData();
  }, []);

  // Function to add a new item to the database
  async function addItem() {
    try {
      const upperCaseName = newMedication.name.toUpperCase(); // Convert name to uppercase
      const newItem = { ...newMedication, name: upperCaseName };

      const { error: insertError } = await supabase
        .from("unit15")
        .insert([newItem]);

      if (insertError) {
        throw insertError;
      }

      // Reset new item form and hide add form
      setNewMedication({ name: "", dose: "", amount: "" });
      setShowAddForm(false);

      // Update medication data after adding new item
      fetchMedicationData();
    } catch (error) {
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
        .from("unit15")
        .select("*")
        .eq("name", name)
        .single();

      if (searchError) throw searchError;
      if (!existingMedication) throw new Error("Medication not found!");

      const currentAmount = existingMedication.amount || 0;
      const updatedAmount = parseInt(currentAmount) + parseInt(amount);

      const { error: updateError } = await supabase
        .from("unit15")
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

  // Function to update the amount of a recent item in the table
  async function updateRecentItem(id) {
    try {
      const { error: updateError } = await supabase
        .from("unit15")
        .update({ amount: editAmount.toString() })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      // Reset edit state
      setEditingItemId(null);
      setEditAmount("");

      // Update medication data after updating recent item
      fetchMedicationData();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item!");
    }
  }

  // Function to delete an item from the database
  async function deleteItem() {
    try {
      const { name } = formData;

      const { error: deleteError } = await supabase
        .from("unit15")
        .delete()
        .eq("name", name);

      if (deleteError) {
        throw deleteError;
      }

      // Reset delete form
      setFormData({ name: "", dose: "", amount: "" });

      // Update medication data after deleting item
      fetchMedicationData();
    } catch (error) {
      alert("Error deleting item!");
    }
  }

  const handleSearch = async (event) => {
    const query = event.target.value.trim().toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredData(recentItems);
    } else {
      const filteredItems = medicationData.filter(
        (item) => item.name.toLowerCase().includes(query)
      );
      setFilteredData(filteredItems);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center bg-gray-900 h-screen">
      <div className="w-full max-w-4xl p-4 bg-gray-700 rounded-lg shadow-lg mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">Medication unit 15</h1>
        <form onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex mb-4 space-x-4">
            <div className="text-black w-1/2">
              <select
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              >
                <option value="" disabled>Select item name</option>
                {medicationData.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-black w-1/2">
              <select
                id="dose"
                value={formData.dose}
                onChange={(e) =>
                  setFormData({ ...formData, dose: e.target.value })
                }
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              >
                <option value="" disabled>Select item dose</option>
                {medicationData.map((item) => (
                  <option key={item.id} value={item.dose}>
                    {item.dose}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-black w-1/2">
              <select
                id="amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              >
                <option value="" disabled>Select amount</option>
                {Array.from({ length: 100 }, (_, i) => i + 1).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
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
        <button
          className="mt-4 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
          onClick={() => setShowAddForm(true)}
        >
          Add New Medication unit 15
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-4 bg-gray-700 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Add New Medication unit 15</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addItem();
              }}
            >
              <div className="mb-4">
                <label htmlFor="newName" className="block mb-2 text-white">Name</label>
                <input
                  id="newName"
                  type="text"
                  value={newMedication.name}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, name: e.target.value })
                  }
                  placeholder="Enter item name"
                  className="w-full text-black px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newDose" className="block mb-2 text-white">Dose</label>
                <input
                  id="newdose"
                  type="text"
                  value={newMedication.dose}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, dose: e.target.value })
                  }
                  placeholder="Enter item dose"
                  className="w-full text-black px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newAmount" className="block mb-2 text-white">Amount</label>
                <select
                  id="newAmount"
                  value={newMedication.amount}
                  onChange={(e) =>
                    setNewMedication({ ...newMedication, amount: e.target.value })
                  }
                  className="w-full text-black px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
                >
                  <option value="" disabled>Select amount</option>
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl p-4 bg-gray-700 rounded-lg shadow-lg mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Recent Items</h2>
        {!editingItemId && (
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearch}
            className="mb-4 px-3 py-2 text-black placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          />
        )}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-white">
            <thead>
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">
                    {editingItemId === item.id ? (
                      <input
                        type="number"
                        min="1"
                        className="w-16 text-black px-2 py-1 border rounded-lg"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />
                    ) : (
                      item.amount
                    )}
                  </td>
                  <td className="py-2">
                    {editingItemId === item.id ? (
                      <button
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        onClick={() => updateRecentItem(item.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600"
                        onClick={() => {
                          setEditingItemId(item.id);
                          setEditAmount(item.amount);
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}