import React from "react";
import "./HierarchyDiagram.css";
import Employee from "./Employee";

const HierarchyDiagram = ({ positions, employees, employeeClick,onDeletePosition }) => {
  const getEmployeeForPosition = (positionName) => {
    return employees.filter((employee) => employee.position === positionName);
  };

  const handleDelete = (positionName) => {
    if (window.confirm(`Biztosan törölni szeretnéd a(z) "${positionName}" pozíciót és alárendeltjeit?`)) {
      onDeletePosition(positionName);
    }
  };

  
  const rootPosition = positions.find((pos) => pos.superior === "");
  const renderHierarchy = (position) => {
    return (
      <div className="position-card" key={position.sorszam}>
        <h4>{position.megnevezes}</h4>
  
        {/* Alkalmazottak megjelenítése */}
          <div className="employees-container">
          {position.employees.map((employee) => (
           
               <Employee
        key={employee.id} // Kulcs hozzáadása az egyedi azonosításhoz
        data={employee}
        handleEmployeeClick={employeeClick}
      />
        
          ))}
       
       </div>
        {/* Alárendelt pozíciók rekurzív renderelése */}
        <div className="subordinates">
          {position.children.map((child) => renderHierarchy(child))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="hierarchy-container">
      {positions.map((rootPosition) => renderHierarchy(rootPosition))}
    </div>
  );
};

export default HierarchyDiagram;
