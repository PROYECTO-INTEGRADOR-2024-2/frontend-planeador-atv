import RegisterPersonForm from "@/components/RegisterPersonForm";
import Image from "next/image";

const Register = () => {
  return (
    <div className="flex flex-row">
      <div className="relative basis-0 md:basis-3/5 bg-no-repeat bg-slate-500 h-screen">
        <Image
          src="/images/bg-login.png"
          alt="Background login image"
          className="object-cover shadow-blue-500/50"
          layout="fill"
        />
      </div>
      <div className="flex-grow">
        <RegisterPersonForm />
      </div>
    </div>
  );
};

export default Register;
