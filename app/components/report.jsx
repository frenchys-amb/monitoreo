'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

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
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(item).map((value, colIndex) => (
                <td key={colIndex} className="border px-4 py-2">{JSON.stringify(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Report() {
  const supabase = createClient();
  const [dataType, setDataType] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (dataType) {
      fetchData(dataType);
    }
  }, [dataType]);

  async function fetchData(table) {
    try {
      console.log(`Fetching data from table: ${table}`);
      const { data: fetchedData, error } = await supabase.from(table).select('*');
      if (error) {
        throw error;
      }
      console.log('Fetched data:', fetchedData);
      setData(fetchedData);
    } catch (error) {
      console.error('Error al obtener los datos:', error.message);
    }
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={() => setDataType('storage')}
          className={`mr-2 px-4 py-2 text-white rounded hover:bg-orange-700 ${dataType === 'Storage' ? 'bg-orange-500' : 'bg-gray-500'}`}
        >
          Storage
        </button>
        <button
          onClick={() => setDataType('medication')}
          className={`mr-2 px-4 py-2 text-white rounded hover:bg-blue-700 ${dataType === 'Medication' ? 'bg-blue-500' : 'bg-gray-500'}`}
        >
          Medication
        </button>
        <button
          onClick={() => setDataType('medication_schedule')}
          className={`mr-2 px-4 py-2 text-white rounded hover:bg-green-700 ${dataType === 'Medication_schedule' ? 'bg-green-500' : 'bg-gray-500'}`}
        >
          Medication Schedule
        </button>
      </div>
      {dataType && <DataDisplay data={data} />}
    </div>
  );
}
