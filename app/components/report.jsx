'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';

function DataDisplay({ data }) {
  if (!data.length) {
    return <div>No hay datos disponibles.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full bg-slate-500 text-white">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key, index) => (
              <th key={index} className="px-4 py-2 bg-sky-900 text-white border border-black">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(item).map((value, colIndex) => (
                <td key={colIndex} className="border border-gray-900 px-4 py-2">{typeof value === 'object' ? JSON.stringify(value) : value}</td>
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

  function downloadCSV() {
    const csvContent = "data:text/csv;charset=utf-8," +
      data.map(row => Object.values(row).map(value => typeof value === 'object' ? JSON.stringify(value) : value).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${dataType}_data.csv`);
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div className="p-4 bg-gray-900 h-screen">
      <div className="mb-4 flex flex-wrap p-4 bg-gray-900">
        <button
          onClick={() => setDataType('storage')}
          className={`mr-2 mb-2 px-4 py-2 text-white rounded hover:bg-orange-700 ${dataType === 'storage' ? 'bg-orange-500' : 'bg-gray-500'}`}
        >
          Storage
        </button>
        <button
          onClick={() => setDataType('medication')}
          className={`mr-2 mb-2 px-4 py-2 text-white rounded hover:bg-blue-700 ${dataType === 'medication' ? 'bg-blue-500' : 'bg-gray-500'}`}
        >
          Medication
        </button>
        <button
          onClick={() => setDataType('medication_schedule')}
          className={`mr-2 mb-2 px-4 py-2 text-white rounded hover:bg-green-700 ${dataType === 'medication_schedule' ? 'bg-green-500' : 'bg-gray-500'}`}
        >
          Medication Schedule
        </button>
        <button
          onClick={() => setDataType('unit15')}
          className={`mr-2 mb-2 px-4 py-2 text-white rounded hover:bg-rose-700 ${dataType === 'unit15' ? 'bg-rose-500' : 'bg-gray-500'}`}
        >
          Unit 15 
        </button>
        <button
          onClick={() => setDataType('form_unit15')}
          className={`mr-2 mb-2 px-4 py-2 text-white rounded hover:bg-violet-700 ${dataType === 'form_unit15' ? 'bg-violet-500' : 'bg-gray-500'}`}
        >
          Form Unit 15
        </button>
        {data.length > 0 && (
          <button
            onClick={downloadCSV}
            className="px-4 py-2 mb-2 ml-auto text-white bg-indigo-700 rounded hover:bg-indigo-500"
          >
            Descargar CSV
          </button>
        )}
      </div>
      {dataType && <DataDisplay data={data} />}
    </div>
  );
}
