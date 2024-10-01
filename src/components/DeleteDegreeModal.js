import React from "react";
import Modal from "react-modal";

function DeleteDegreeModal(open, nombre, id) {
  const [showModal, setShowModal] = useState(open);
  const deleteDegree = (id) => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/degree/${id}`,
          {
            method: "DELETE", // Especifica el método DELETE
            headers: {
              "Content-Type": "application/json", // Si es necesario, ajusta los headers
            },
          }
        );

        if (!response.ok) {
          throw new Error("Respuesta no válida");
        }

        const result = await response.json();
        setData(result);

        console.log(
          "-------------------------------------------------------------"
        );
        console.log(result);
      } catch (error) {
        setError(error.message);
        console.log(
          "-------------------------------------------------------------"
        );
        console.log(error.message);
      }
    };

    fetchData();
  };
  return (
    <div>
      <div className="flex items-center blur-md">
        <Modal
          isOpen={open}
          className={"absolute flex flex-col w-[40vw] left-[35vw] top-[15vh]"}
        >
          <div className="w-[30vw] bg-[#d9d9d9] px-8 pb-8 rounded-[50px] p-2 mb-8">
            <div className="w-full text-center my-[3vh]">
              <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-red-500 md:text-2xl lg:text-4xl dark:text-black">
                Borrar carrera
              </h1>
              <h2>
                ¿Está seguro que desea borrar la asignatura {nombre} con id {id}
                ?
              </h2>
            </div>
            <form className="space-y-4 md:space-y-2" action="#">
              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="w-[50%] text-white bg-[#ff1d1d] hover:bg-[#ff2828a9] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
                  onClick={() => setShowModal(false)}
                >
                  Borrar carrera
                </button>
                <button
                  type="submit"
                  className="w-[50%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-3xl text-xl px-5 2xl:py-2.5 text-center md:p-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default DeleteDegreeModal;
