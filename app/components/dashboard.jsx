'use client'
import React, { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import MedicationSummary from "./MedicationSummary";
import StorageSummary from "./StorageSummary";

export default function Dashboard() {
  const supabase = createClient();
  const [medicationData, setMedicationData] = useState([]);
  const [storageData, setStorageData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const medicationResponse = await supabase.from("medication").select("*");
        const storageResponse = await supabase.from("storage").select("*");

        if (medicationResponse.error) {
          throw medicationResponse.error;
        }
        if (storageResponse.error) {
          throw storageResponse.error;
        }

        setMedicationData(medicationResponse.data);
        setStorageData(storageResponse.data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error); // Set error state for UI feedback
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="bg-gray-900 min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold text-white mb-8">Dashboard</h1>

        {isLoading ? (
          <p className="text-white text-lg">Loading...</p>
        ) : error ? (
          <div className="bg-red-500 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Error Loading Data</h2>
            <p className="text-white">An error occurred while loading data. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Medication Summary</h2>
              <MedicationSummary medicationData={medicationData} />
            </div>
            <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Storage Summary</h2>
              <StorageSummary storageData={storageData} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}