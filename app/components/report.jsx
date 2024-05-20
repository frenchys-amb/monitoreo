'use client';

import React, { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

function DataDisplay({ data }) {
  if (!data.length) {
    return <div>No hay datos disponibles.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-black">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key, index) => (
              <th key={index} className="px-4 py-2 bg-gray-700 text-left">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, subIndex) => (
                <td key={subIndex} className="border px-4 py-2">{JSON.stringify(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DataViewer() {
  const supabase = createClient();
  const [dataType, setDataType] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (dataType) {
      fetchData();
    }
  }, [dataType]);

  async function fetchData() {
    try {
      const table = dataType.toLowerCase(); // Usa el valor de dataType para determinar la tabla
      const { data: fetchedData, error } = await supabase.from(table).select("*");
      if (error) {
        throw error;
      }
      if (fetchedData) {
        setData(fetchedData);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error.message);
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <button onClick={() => setDataType("Storage")} className="mr-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700">Storage</button>
        <button onClick={() => setDataType("Medication")} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Medication</button>
        <button onClick={() => setDataType("Medication_schedule")} className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Medication Schedule</button>
      </div>
      {dataType && <DataDisplay data={data} />}
    </div>
  );
}
