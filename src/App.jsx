// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importação dos componentes/páginas
import Header from "./components/Header";
import Home from "./pages/Home";
import Cerimonia from "./pages/Cerimonia";
import ConfirmarPresenca from "./pages/ConfirmarPresenca";
import ListaDePresentes from "./pages/ListaDePresentes";

function App() {
  return (
    <Router basename="/casamento-react">
      <Header /> {/* Header fixo em todas as páginas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cerimonia" element={<Cerimonia />} />
        <Route path="/confirmar-presenca" element={<ConfirmarPresenca />} />
        <Route path="/lista-de-presentes" element={<ListaDePresentes />} />
      </Routes>
    </Router>
  );
}

export default App;
