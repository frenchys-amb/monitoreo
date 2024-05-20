"use client";

import React, { useState } from "react";
import AddStorage from "../components/AddStorage";
import AddMxStorage from "../components/AddMxStorage";
import Report from "../components/report";
import Dashboard from "../components/dashboard";

export default function Home() {
  const [showInventoryMenu, setShowInventoryMenu] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [showAddStorage, setShowAddStorage] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [activeComponent, setActiveComponent] = useState("Home");

  const handleToggleAddStorageForm = () => {
    setActiveForm("storage");
    setShowWelcomeMessage(false);
    setShowAddStorage(true);
  };

  const handleToggleAddMedicineForm = () => {
    setActiveForm("medication");
    setShowWelcomeMessage(false);
    setActiveComponent("Storage");
  };

  const handleToggleInventoryMenu = () => {
    setShowInventoryMenu(!showInventoryMenu);
    setShowWelcomeMessage(false);
    setActiveComponent(null);
  };

  const handleToggleDashboard = () => {
    setShowWelcomeMessage(true);
    setActiveForm(null);
    setActiveComponent("Home");
  };

  const handleToggleReport = () => {
    setShowWelcomeMessage(true);
    setActiveForm(null);
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
                    className="py-2 text-lg"
                    onClick={handleToggleInventoryMenu}
                  >
                    Inventory
                  </button>
                </li>
                {showInventoryMenu && (
                  <div>
                    <ul>
                      <li>
                        <button
                          className="py-2 text-blue-700"
                          onClick={handleToggleAddStorageForm}
                        >
                          Storage
                        </button>
                      </li>
                      <li>
                        <button
                          className="py-2 text-orange-700"
                          onClick={handleToggleAddMedicineForm}
                        >
                          Medication
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
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
              {activeForm === "storage" && showAddStorage && (
                <AddStorage onAgregarAlmacen={handleAgregarAlmacen} />
              )}
              {activeForm === "medication" && showInventoryMenu && (
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
