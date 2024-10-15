import React from 'react'
import Modal from "react-modal";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

function ModalRegister({ open, onClose }) {
    const router = useRouter();
    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            className="absolute flex flex-col w-[40vw] left-[35vw] top-[15vh]"
        >
            <div className="w-[30vw] bg-[#F1F2EE] px-8 pb-8 rounded-[15px] p-2 mb-8">
                <div className="w-full text-center my-[3vh]">
                    <h1 className="mb-4 text-xl font-extrabold leading-none tracking-tight text-red-500 md:text-2xl lg:text-4xl dark:text-black">
                        Registro existoso
                    </h1>
                    <div className="flex justify-center flex-col pt-2 ">
                        <div className="flex flex-row justify-center ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6" /><circle cx="10" cy="8" r="5" /><path d="m16 19 2 2 4-4" /></svg>
                        </div>
                        <div className="flex flex-row justify-center pt-6">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => router.push("../login")}
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => router.push("../")}
                                className="w-[40%] text-white bg-[#6f7e91] hover:bg-[#4d5866] focus:ring-4 focus:outline-none font-medium rounded-md text-xl px-1 2xl:py-2.5 text-center md:p-1 ml-4"
                                
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </Modal>
    );

} export default ModalRegister