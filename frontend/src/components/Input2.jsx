import { Size } from "../styles/Styles";

export function Input2(type, id, placeholder, icon, options = null, extraProps = {}) {
    return (
        <>
            <label htmlFor={id} className={`block mb-2 ${Size.LARGE} font-[sansation-regular]`}>
                {placeholder}
            </label>

            <div className="flex">
                <span className={`bg-white inline-flex items-center px-3 ${Size.LARGE} rounded-l-full border border-neutral-400`}>
                    {icon && (
                        <div className="text-gray-500 text-xl">
                            {icon}
                        </div>
                    )}
                </span>

                {type === "select" ? (
                    <select
                        id={id}
                        name={id}
                        required
                        className={`bg-white rounded-none rounded-r-full w-full h-[40px] border text-[#353C43] flex-1 ${Size.LARGE} border-neutral-400 p-3 border-l-0 font-[sansation-regular]`}
                    >
                        <option value="">Seleccione {placeholder}</option>

                        {options.map((op, i) => (
                            <option key={i} value={op}>
                                {op}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        id={id}
                        name={id}
                        placeholder={placeholder}
                        {...extraProps}
                        className={`bg-white rounded-none rounded-r-full w-full h-[40px] border text-[#353C43] flex-1 ${Size.LARGE} border-neutral-400 p-3 border-l-0 font-[sansation-regular]`}
                    />
                )}
            </div>
        </>
    );
}