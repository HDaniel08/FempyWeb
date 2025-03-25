'use client'
import React, { useState } from 'react';


const PositionForm = ({ addPosition, positions }) => {
  const [positionName, setPositionName] = useState('');
  const [superior, setSuperior] = useState('');
  const handlePositionNameChange = (e) => setPositionName(e.target.value);
  const handleSuperiorChange = (e) => setSuperior(e.target.value);

  const flattenPositions = (positions, level = 0) => {
    let flatList = [];
    positions.forEach((position) => {
      flatList.push({ ...position, level }); // Szint megőrzése indentáláshoz
      if (position.children && position.children.length > 0) {
        flatList = flatList.concat(flattenPositions(position.children, level + 1));
      }
    });
    return flatList;
  };
  const flattenedPositions = flattenPositions(positions);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPosition(positionName, superior);
    setPositionName('');
    setSuperior('');
  };

  return (
    <div className="card">
      <h2>Új pozíció</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={positionName}
          onChange={handlePositionNameChange}
          placeholder="Pozíció neve"
          required
        />
        <select
          value={superior}
          onChange={handleSuperiorChange}
        >
          <option value="">Nincs felettes</option>
          {flattenedPositions.map((position) => (
            <option key={position.sorszam} value={position.sorszam}>
              {position.megnevezes}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!positionName}>
          Pozíció hozzáadása
        </button>
      </form>
    </div>
  );
};



export default PositionForm;
