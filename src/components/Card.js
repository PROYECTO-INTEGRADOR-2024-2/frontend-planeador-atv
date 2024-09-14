"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SubjectRegister from "./SubjectRegister";

const Card = ({ title, content, text_button, ruta }) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  return (
    <div className="bg-gray-100 rounded-lg shadow-md py-2">
      <div className="bg-gray-200 mx-auto border border-slate-400 ">
        <h1 className="text-3xl font-bold py-5 text-gray-600 mx-4 text-center">
          {title}
        </h1>
      </div>
      <div className="p-8 flex-col content-center flex items-center">
        <p className="text-2xl font-bold text-gray-500 text-center">
          {content}
        </p>
        <button
          type="button"
          className="text-gray-90 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 bg-slate-500 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 mt-4"
          onClick={ruta ? () => router.push(ruta) : () => setShowModal(true)}
        >
          {text_button}
        </button>
      </div>
      <SubjectRegister
        showModal={showModal}
        useStates={[showModal, setShowModal]}
      />
    </div>
  );
};

export default Card;
