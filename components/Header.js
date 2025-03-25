'use client'
import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [hovered, setHovered] = useState(null);

  const handleMouseEnter = (index) => setHovered(index);
  const handleMouseLeave = () => setHovered(null);

  return (
    <header style={headerStyle}>
      <nav>
        <ul style={navListStyle}>
          <li
            style={navItemStyle}
            onMouseEnter={() => handleMouseEnter(0)}
            onMouseLeave={handleMouseLeave}
          >
            <Link href="/queries" style={hovered === 0 ? { ...linkStyle, ...linkHoverStyle } : linkStyle}>
              Lekérdezések
            </Link>
          </li>
          <li
            style={navItemStyle}
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
          >
            <Link href="/organization" style={hovered === 1 ? { ...linkStyle, ...linkHoverStyle } : linkStyle}>
              Szervezeti felépítés
            </Link>
          </li>
          <li
            style={navItemStyle}
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave}
          >
            <Link href="/settings" style={hovered === 2 ? { ...linkStyle, ...linkHoverStyle } : linkStyle}>
              Beállítások
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

const headerStyle = {
  backgroundColor: '#9da9b8', // Halvány szürke háttér
  padding: '10px 20px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Finom árnyék
  borderBottom: '2px solid #ddd', // Finom elválasztó vonal
};

const navListStyle = {
  display: 'flex',
  listStyle: 'none',
  justifyContent: 'center', // Középre igazítva
  margin: 0,
  padding: 0,
};

const navItemStyle = {
  margin: '0 15px',
};

const linkStyle = {
  textDecoration: 'none',
  fontSize: '16px',
  color: 'white',
  fontWeight: '600',
  textTransform: 'uppercase', // Nagybetűs szöveg
  padding: '8px 12px',
  borderRadius: '4px', // Lekerekített sarkok
  transition: 'all 0.3s ease', // Simulált átmenet
};

const linkHoverStyle = {
  backgroundColor: '#d3135c', // Kék háttér szín
  color: '#fff', // Fehér szöveg
  transform: 'scale(1.1)', // Finom méretezés, ha fölé viszik
};
