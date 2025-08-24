// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css"; // ou importe o CSS globalmente

const Header = () => {
  return (
    <header>
      <nav>
        <Link to="/">O Casal</Link>
        <Link to="/cerimonia">A Cerimônia</Link>
        <Link to="/confirmar-presenca">Confirmação de Presença</Link>
        <Link to="/lista-de-presentes">Lista de Presentes</Link>
      </nav>
    </header>
  );
};

export default Header;
