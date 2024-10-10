import RegisterPersonForm from "@/components/RegisterPersonForm";
import Image from "next/legacy/image";

const register = () => {
  return (
    <div className="flex flex-row ">
      <div className="basis-0  bg-no-repeat md:basis-3/5 bg-cover bg-slate-500 h-screen relative">
        <Image
          src="/images/bg-login.png"
          alt="Background login image"
          className="object-full shadow-blue-500/50 Sw-[50%]"
          layout="fill"
        />
      </div>
      <RegisterPersonForm />
    </div>
  );
};

export default register;
