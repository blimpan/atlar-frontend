import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home";
import Payments from "./pages/Payments";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/payments" element={<Payments/>} />
    </Routes>
  )
}

export default App
