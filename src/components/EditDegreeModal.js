import React from "react";
import Modal from "react-modal";
import { useState, useEffect } from "react";
function EditDegreeModal({ open, id, onClose }) {

  const [degree, setDegree] = useState({
    degree_name: "",
    degree_modality: "",
    degree_department: "",
  });

  useEffect(() => {
    const fetchDegreeData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/degree/${id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la carrera");
        }
        const data = await response.json();
        setDegree(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    if (id) {
      fetchDegreeData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDegree((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const editDegree = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/degree/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(degree),
      });

      if (!response.ok) {
        throw new Error("Respuesta no válida");
      }

      const result = await response.json();
      console.log("Carrera editada:", result);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error al editar carrera:", error.message);
    }
  };

  return (
    <Modal isOpen={open} onRequestClose={onClose}>
      <h2>Editar Carrera</h2>
      <div>
        <label>
          Nombre:
          <input
            type="text"
            name="degree_name"
            value={degree.degree_name}
            onChange={handleChange}
          />
        </label>
        <label>
          Modalidad:
          <input
            type="text"
            name="degree_modality"
            value={degree.degree_modality}
            onChange={handleChange}
          />
        </label>
        <label>
          Facultad:
          <input
            type="text"
            name="degree_department"
            value={degree.degree_department}
            onChange={handleChange}
          />
        </label>
        <button onClick={editDegree}>Editar carrera</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
}

export default EditDegreeModal;