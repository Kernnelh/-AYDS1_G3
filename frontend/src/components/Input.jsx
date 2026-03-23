// Input.jsx
import { Size } from "../styles/Styles";

export function Input(type, id, placeholder, icon) {
  return (
    <div className="flex flex-col items-center w-[90%] md:w-[70%] xl:w-[75%]">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-[20px] xl:pl-[1.5rem] pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          required
          id={id}
          name={id}
          className={`h-[40px] md:h-[3.2rem] lg:h-[3.8rem] bg-[#FAFAFF] border border-gray-300 text-gray-900 ${Size.LARGE} rounded-full block w-full pl-[4rem] md:pl-[50px] xl:pl-[4rem] px-5`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}