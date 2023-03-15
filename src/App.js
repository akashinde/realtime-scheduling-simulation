import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./components/menu";
import FCFS from "./components/menu/simulationView/FCFS";
import RMS from "./components/menu/simulationView/RMS";
import EDF from "./components/menu/simulationView/EDF";

function App() {

  const [processes, setProcesses] = useState([]);
  const [currentAlgo, setCurrentAlgo] = useState("");

  return (
    <div className="App">
      <h1>Real-Time Scheduling Simulation</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu processState={[processes, setProcesses]} algoState={[currentAlgo, setCurrentAlgo]} />} />
          <Route path="/FCFS" element={<FCFS processState={[processes, setProcesses]} algoState={[currentAlgo, setCurrentAlgo]} />} />
          <Route path="/RMS" element={<RMS processState={[processes, setProcesses]} algoState={[currentAlgo, setCurrentAlgo]} />} />
          <Route path="/EDF" element={<EDF processState={[processes, setProcesses]} algoState={[currentAlgo, setCurrentAlgo]} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
