'use client',
import React, { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

export default function Medication() {
  const supabase = createClient();
  const [formData, setFormData] = useState({ name: '', license: '', unit: '', medication: '', amount: '' });
  const [medicationData, setMedicationData] = useState([]);

  async function fetchMedicationData() {
    try {
      const { data, error } = await supabase.from('medication_schedule').select('*');
      if (error) throw error;
      setMedicationData(data);
    } catch (error) {
      alert('Error loading medication data!');
      console.error('Error loading medication data:', error.message);
    }
  }

  useEffect(() => {
    fetchMedicationData();
  }, []);

  async function addItem() {
    try {
      // Fetch current amount of the specified medication
      const { data: medication, error: fetchError } = await supabase
        .from('medication')
        .select('amount')
        .eq('name', formData.medication)
        .single();
      if (fetchError) throw fetchError;

      // Calculate new amount
      const newAmount = medication.amount - formData.amount;
      if (newAmount < 0) {
        alert('Insufficient medication amount available!');
        return;
      }

      // Update the medication amount in the 'medication' table
      const { error: updateError } = await supabase
        .from('medication')
        .update({ amount: newAmount })
        .eq('name', formData.medication);
      if (updateError) throw updateError;

      // Insert new item into the 'medication_schedule' table
      const { error: insertError } = await supabase
        .from('medication_schedule')
        .insert([formData]);
      if (insertError) throw insertError;

      setFormData({ name: '', license: '', unit: '', medication: '', amount: '' });
      fetchMedicationData();
      alert('Data inserted successfully');
    } catch (error) {
      alert('Error adding item!');
      console.error('Error adding item:', error.message);
    }
  }

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="w-full max-w-lg p-4 bg-gray-700 bg-opacity-75 rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl font-bold text-white mb-4">Medication Schedule Form</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="mb-4 text-black">
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-4 text-black">
            <label htmlFor="license" className="block mb-2">License</label>
            <input
              id="license"
              type="text"
              value={formData.license}
              onChange={(e) => setFormData({ ...formData, license: e.target.value })}
              placeholder="Enter license"
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-4 text-black">
            <label htmlFor="unit" className="block mb-2">Unit</label>
            <input
              id="unit"
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="Enter unit"
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-4 text-black">
            <label htmlFor="medication" className="block mb-2">Select Medication</label>
            <select
              id="medication"
              value={formData.medication}
              onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            >
              <option value="">Select Medication</option>
              {medicationData.map((medication) => (
                <option key={medication.id} value={medication.name}>
                  {medication.name}
                </option>
              ))}
              {/* Adding manually */}
              <option value="Solumebrol">Solumebrol</option>
              <option value="Atropina">Atropina</option>
            </select>
          </div>
          <div className="mb-4 text-black">
            <label htmlFor="amount" className="block mb-2">Amount</label>
            <input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter amount"
              className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
              onClick={addItem}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
