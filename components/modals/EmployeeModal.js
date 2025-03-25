import React, { useState } from "react";
import "./EmployeeModal.css";

const EmployeeModal = ({ isOpen, onClose, employeeData, onSave }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString); // ISO string dátummá alakítása
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Hónap 2 számjegyre
    const day = String(date.getDate()).padStart(2, '0'); // Nap 2 számjegyre
    return `${year}-${month}-${day}`; // YYYY-MM-DD formátum
  };
  const [formData, setFormData] = useState({
    name: employeeData?.vezeteknev+" "+employeeData?.keresztnev || "",
    email: employeeData?.email || "",
    birthdate: formatDate(employeeData?.szuletesnap) || "",
    position: employeeData?.pozicio_nev || "",
    password:  employeeData?.password, // Új mező a jelszóhoz
  });

  const [showPassword, setShowPassword] = useState(false); // Jelszó megjelenítésének állapota

  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null; // Ha nincs nyitva, ne renderelje a modalt

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Munkatárs adatai</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Név</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Jelszó</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"} // Jelszó megjelenítése vagy elrejtése
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={handlePasswordToggle}
                aria-label={
                  showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"
                }
              >
                <img
                  src={
                    showPassword
                      ? "/icons/eye-open.png"
                      : "/icons/eye-closed.png"
                  }
                  alt={
                    showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"
                  }
                  className="password-icon"
                />
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="birthdate">Születési dátum</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
           
              placeholder=""
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Pozíció</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              disabled // Csak olvasható
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Mégse
            </button>
            <button type="submit" className="save-button">
              Mentés
            </button>
            <button type="button" className="del-button">
              Törlés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
