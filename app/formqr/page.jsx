'use client'

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
      // Verificar si el medicamento seleccionado está en la lista manual
      const manualMedications = [
        "Solumebrol",
        "Atropina",
        "Epinefrina 1:10,000",
        "Toradol",
        "Etomidato",
        "Flumazenil",
        "Adenosina",
        "Enlaprile",
        "Amiodarone",
        "Plvix",
        "Dexamethasone"
      ];
      if (!manualMedications.includes(formData.medication)) {
        alert('Please select a medication from the list.');
        return;
      }

      // Insertar el nuevo elemento en la tabla 'medication_schedule'
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
          <div className="mb-4 text-white">
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter name"
              className="w-full px-3 py-2 placeholder-gray-400 text-black border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-4 text-white">
            <label htmlFor="license" className="block mb-2">License</label>
            <input
              id="license"
              type="text"
              value={formData.license}
              onChange={(e) => setFormData({ ...formData, license: e.target.value })}
              placeholder="Enter license"
              className="w-full px-3 py-2 placeholder-gray-400 text-black border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-4 text-white">
            <label htmlFor="unit" className="block mb-2">Unit</label>
            <input
              id="unit"
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="Enter unit"
              className="w-full px-3 py-2 placeholder-gray-400 text-black border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>
          <div className="mb-4 text-white">
            <label htmlFor="medication" className="block mb-2">Select Medication</label>
            <select
              id="medication"
              value={formData.medication}
              onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
              className="w-full px-3 py-2 placeholder-gray-400 text-black border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            >
              <option value="">Select Medication</option>
              {/* Manual medication options */}
              <option value="Solumebrol">Solumebrol</option>
              <option value="Atropina">Atropina</option>
              <option value="Epinefrina 1:10,000">Epinefrina 1:10,000</option>
              <option value="Toradol">Toradol</option>
              <option value="Etomidato">Etomidato</option>
              <option value="Flumazenil">Flumazenil</option>
              <option value="Adenosina">Adenosina</option>
              <option value="Enlaprile">Enlaprile</option>
              <option value="Amiodarone">Amiodarone</option>
              <option value="Plvix">Plavix</option>
              <option value="Dexamethasone">Dexamethasone</option>
            </select>
          </div>
          <div className="mb-4 text-white">
            <label htmlFor="amount" className="block mb-2">Amount</label>
            <input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter amount"
              className="w-full px-3 py-2 placeholder-gray-400 text-black border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
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
