'use client'
import React, { useState } from 'react';


const EmployeeForm = ({ addEmployee, positions }) => {
    const [employeeName, setEmployeeName] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
  
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

    const handleNameChange = (e) => setEmployeeName(e.target.value);
    const handlePositionChange = (e) => setSelectedPosition(e.target.value);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (employeeName && selectedPosition) {
        addEmployee(employeeName, selectedPosition);
        setEmployeeName('');
        setSelectedPosition('');
      }
    };
  
    return (
      <div className="card">
        <h2>Új alkalmazott</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={employeeName}
            onChange={handleNameChange}
            placeholder="Alkalmazott neve"
            required
          />
          <select
            value={selectedPosition}
            onChange={handlePositionChange}
            required
          >
            <option value="">Válassz pozíciót</option>
            {flattenedPositions.map((position) => (
              <option key={position.sorszam} value={position.sorszam}>
                {position.megnevezes}
              </option>
            ))}
          </select>
          <button type="submit" disabled={!employeeName || !selectedPosition}>
            Alkalmazott hozzáadása
          </button>
        </form>
      </div>
    );
  };
  
  export default EmployeeForm;