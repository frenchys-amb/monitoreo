"use client";

import React, { useState } from "react";
import AddStorage from "../components/AddStorage";
import AddMxStorage from "../components/AddMxStorage";
import Report from "../components/report";
import Dashboard from "../components/dashboard";

export default function Home() {
  const [showAddStorage, setShowAddStorage] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [activeComponent, setActiveComponent] = useState("Home");

  const handleToggleAddStorageForm = () => {
    setShowWelcomeMessage(false);
    setShowAddStorage(true);
    setShowAddMedication(false);
    setActiveComponent("Storage");
  };

  const handleToggleAddMedicationForm = () => {
    setShowWelcomeMessage(false);
    setShowAddStorage(false);
    setShowAddMedication(true);
    setActiveComponent("Medication");
  };

  const handleToggleDashboard = () => {
    setShowWelcomeMessage(true);
    setShowAddStorage(false);
    setShowAddMedication(false);
    setActiveComponent("Home");
  };

  const handleToggleReport = () => {
    setShowWelcomeMessage(true);
    setShowAddStorage(false);
    setShowAddMedication(false);
    setActiveComponent("report");
  };

  const handleAgregarAlmacen = (data) => {
    console.log("Data:", data);
  };

  const handleAgregarMedicamento = (data) => {
    console.log("Medication Data:", data);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-800">
      <div className="flex flex-col h-screen">
        <div className="flex flex-grow">
          <aside className="bg-gray-700 text-white">
            <div
              className="p-4"
              style={{ display: "inline-block", minWidth: "fit-content" }}
            >
              <h1 className="text-3xl">Frenchys Amb</h1>
              <hr className="border-t border-gray-600 my-4 w-full" />
              <ul>
                <li>
                  <button
                    className="py-2 text-lg"
                    onClick={handleToggleDashboard}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    className="py-2 text-lg text-white"
                    onClick={handleToggleAddStorageForm}
                  >
                    Storage
                  </button>
                </li>
                <li>
                  <button
                    className="py-2 text-lg text-white"
                    onClick={handleToggleAddMedicationForm}
                  >
                    Medication
                  </button>
                </li>
                <li>
                  <button
                    className="py-2 text-lg text-green-700"
                    onClick={handleToggleReport}
                  >
                    Report
                  </button>
                </li>
              </ul>
            </div>
          </aside>
          <main
            className="flex-grow p-2 overflow-auto"
            style={{
              backgroundImage: `url('/logo.png')`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <div className="container mx-auto text-white">
              {showAddStorage && (
                <AddStorage onAgregarAlmacen={handleAgregarAlmacen} />
              )}
              {showAddMedication && (
                <AddMxStorage onAgregarMedicamento={handleAgregarMedicamento} />
              )}
              {activeComponent === "Home" && <Dashboard />}
              {activeComponent === "report" && <Report />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
