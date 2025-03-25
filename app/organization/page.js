'use client'
import React, { useEffect, useState } from 'react';
import PositionForm from './components/PositionForm';
import EmployeeForm from './components/EmployeeForm';
import HierarchyDiagram from './components/HierarchyDiagram';
import './page.css';
import EmployeeModal from '@/components/modals/EmployeeModal';

const Organization = () => {
  const [positions, setPositions] = useState([]); // Pozíciók állapota
  const [employees, setEmployees] = useState([]); // Alkalmazottak állapota
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeData,setEmployeeData]=useState([]);

  const buildHierarchy = (positions, employees) => {
    const map = {}; // Pozíciók gyors hozzáféréséhez
    const hierarchy = []; // Gyökér pozíciók
  
    // Pozíciók indexelése
    positions.forEach((position) => {
      map[position.sorszam] = { ...position, children: [], employees: [] }; // Új mező: employees
    });
  
    // Alkalmazottak hozzárendelése
    employees.forEach((employee) => {
      if (map[employee.pozicio]) {
        map[employee.pozicio].employees.push(employee); // Hozzáadjuk az alkalmazottat a megfelelő pozícióhoz
      }
    });
  
    // Hierarchia felépítése
    positions.forEach((position) => {
      if (position.felettes) {
        // Ha van felettes, akkor az adott pozíciót hozzáadjuk a felettes "children" mezőjéhez
        map[position.felettes].children.push(map[position.sorszam]);
      } else {
        // Ha nincs felettes, akkor ez egy gyökér pozíció
        hierarchy.push(map[position.sorszam]);
      }
    });
  
    return hierarchy;
  };
  
  const fetchData = async () => {
    try {
      const [positionsResponse, employeesResponse] = await Promise.all([
        fetch('/api/hierarchy'),
        fetch('/api/employees'),
      ]);

      const positionsData = await positionsResponse.json();
      const employeesData = await employeesResponse.json();

      const structuredHierarchy = buildHierarchy(positionsData, employeesData); // Pozíciók és alkalmazottak összekapcsolása
      setPositions(structuredHierarchy);
    } catch (error) {
      console.error('Hiba az adatok betöltésekor:', error);
    }
  };

  useEffect(() => {
   
  
    fetchData();
  }, []);



  const employeeClick=(data)=>{
    setEmployeeData(data);
    setModalOpen(true);
  }
  const closeModal = () => {
    setModalOpen(false); // Modal bezárása
  };
  const handleSave=()=>{
    
  }
  const handleDeletePosition = async (positionName) => {
    if (window.confirm(`Biztosan törölni szeretnéd a(z) "${positionName}" pozíciót és alárendeltjeit?`)) {
      try {
        const response = await fetch('/api/hierarchy', {
          method: 'DELETE',
          body: JSON.stringify({ megnevezes: positionName }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setPositions((prevPositions) =>
            prevPositions.filter((pos) => pos.name !== positionName)
          );
          setEmployees((prevEmployees) =>
            prevEmployees.filter((emp) => emp.position !== positionName)
          );
        } else {
          console.error('Hiba a pozíció törlésekor');
        }
      } catch (error) {
        console.error('Hiba a pozíció törlésekor:', error);
      }
    }
  };
  // Pozíció hozzáadása
  const addPosition = async (positionName, superior) => {
    try {
      const response = await fetch('/api/hierarchy', {
        method: 'POST',
        body: JSON.stringify({
          megnevezes: positionName,
          felettes: superior || null,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
          fetchData();
      } else {
        console.error('Hiba a pozíció hozzáadásakor');
      }
    } catch (error) {
      console.error('Hiba a pozíció hozzáadásakor:', error);
    }
  };

  // Alkalmazott hozzáadása
  const addEmployee = async (employeeName, positionName) => {
    const [lastName, firstName] = employeeName.split(' ');
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        body: JSON.stringify({
          vezeteknev: lastName,
          keresztnev: firstName || '',
          email: '', // Ha van email, hozzáadható itt
          pozicio: positionName,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchData();
      } else {
        console.error('Hiba az alkalmazott hozzáadásakor');
      }
    } catch (error) {
      console.error('Hiba az alkalmazott hozzáadásakor:', error);
    }
  };

  return (
    <div className="organization">
      <h1>Vállalati Struktúra</h1>
      <div className="forms-container">
        <PositionForm addPosition={addPosition} positions={positions} />
        <EmployeeForm addEmployee={addEmployee} positions={positions} />
      </div>
      <HierarchyDiagram positions={positions} employees={employees} employeeClick={employeeClick} onDeletePosition={handleDeletePosition}/>
      {modalOpen && (
        <EmployeeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        employeeData={employeeData}
        onSave={handleSave}
      />
      )}
    </div>
  );
};

export default Organization;
