import RegisterPersonForm from "@/components/RegisterPersonForm";

const register = () => {
  return (
    <div className="flex flex-row ">
      <div className="basis-0  bg-no-repeat md:basis-3/5 bg-cover bg-slate-500 h-screen ">
        <img
          src="/images/bg-login.png"
          className="object-full shadow-blue-500/50 h-screen"
        ></img>
      </div>
      <RegisterPersonForm />
    </div>
  );
};

export default register;
