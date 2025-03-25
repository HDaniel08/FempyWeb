'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import './Employee.css';

function Employee({ data, handleEmployeeClick }) {

  const [style, setStyle] = useState({
    opacity: 0,
    transform: 'translateY(-10px)',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStyle({
        opacity: 1,
        transform: 'translateY(0)',
        transition: 'all 0.5s ease',
      });
    }, 10); // Kis késleltetés a simább animációért

    return () => clearTimeout(timeout); // Takarítsuk el az időzítőt
  }, []);

  return (
    <div
      className="employee-container"
      style={style}
      onClick={handleEmployeeClick.bind(this, data)}
    >
      <div className="flexible-div">
        <div>
          <Image
            src="/avatars/avatar_1.png"
            width={60}
            height={60}
            alt="Employee avatar"
          />
        </div>
        <div className="profile-details">
          <div className="text-name">{data.vezeteknev} {data.keresztnev}</div>
          
        </div>
      </div>
    </div>
  );
}

export default Employee;
