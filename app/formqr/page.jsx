'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

export default function Medication() {
  const supabase = createClient();
  const [formData, setFormData] = useState({ name: '', license: '', unidad: '', medication: '', amount: '' });
  const [medicationData, setMedicationData] = useState([]);

  useEffect(() => {
    fetchMedicationData();
  }, []);

  async function fetchMedicationData() {
    try {
      const { data, error } = await supabase
        .from('medication')
        .select('*');
      if (error) {
        throw error;
      }
      setMedicationData(data);
    } catch (error) {
      console.error('Error loading medication data:', error.message);
      alert('Error loading medication data!');
    }
  }

  async function addItem(e) {
    e.preventDefault();
    try {
      const selectedMedication = medicationData.find(med => med.name === formData.medication);
      if (!selectedMedication) {
        alert('Please select a medication from the list.');
        return;
      }

      const amountToReduce = parseInt(formData.amount);
      if (isNaN(amountToReduce) || amountToReduce <= 0) {
        alert('Please enter a valid amount.');
        return;
      }

      // const updatedAmount = selectedMedication.amount - amountToReduce;
      // if (updatedAmount < 0) {
      //  alert('Not enough medication available to reduce the specified amount.');
      //  return;
      // }

      // const { error: updateError } = await supabase
      //   .from('medication')
      //  .update({ amount: updatedAmount })
      //  .eq('name', formData.medication);

      // if (updateError) {
      //  throw updateError;
      // }

      const { error: insertError } = await supabase
        .from('medication_schedule')
        .insert([{
          name: formData.name,
          license: formData.license,
          unidad: formData.unidad,
          medication_name: formData.medication,
          amount: formData.amount
        }]);

      if (insertError) {
        throw insertError;
      }

      setFormData({ name: '', license: '', unidad: '', medication: '', amount: '' });
      fetchMedicationData();
      alert('Data inserted successfully');
    } catch (error) {
      console.error('Error adding item:', error.message);
      alert('Error adding item!');
    }
  }

  return (
    <main className="flex justify-center items-center bg-gray-700 h-screen">
      <div className="w-full max-w-lg p-4 bg-sky-900 rounded-lg shadow-lg mt-8">
        <h1 className="text-2xl font-bold text-red-800 mb-4">Medication Schedule Form</h1>
        <form onSubmit={addItem}>
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
            <label htmlFor="unidad" className="block mb-2">Unidad</label>
            <select
              id="unidad"
              value={formData.unidad}
              onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
              className="w-full px-3 py-2 placeholder-gray-400 text-black border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            >
              <option value="">Select Unidad</option>
              {/* Manual unidad options */}
              <option value="F-01">F-01</option>
              <option value="F-02">F-02</option>
              <option value="F-03">F-03</option>
              <option value="F-04">F-04</option>
              <option value="F-05">F-05</option>
              <option value="F-06">F-06</option>
              <option value="F-07">F-07</option>
              <option value="F-08">F-08</option>
              <option value="F-09">F-09</option>
              <option value="F-10">F-10</option>
              <option value="F-11">F-11</option>
              <option value="F-12">F-12</option>
              <option value="F-13">F-13</option>
              <option value="F-14">F-14</option>
              <option value="F-15">F-15</option>
            </select>
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
              {medicationData.map((med) => (
                <option key={med.id} value={med.name}>
                  {med.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 text-white">
            <label htmlFor="amount" className="block mb-2">Amount</label>
            <select
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 placeholder-gray-400 text-black border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              required
            >
              <option value="">Select amount</option>
              {/* Manual unidad options */}
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
