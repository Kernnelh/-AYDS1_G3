import { Size } from "../styles/styles";

export function CheckBox() {
    return (
        <div className="flex items-center">
        <label className="relative flex items-center cursor-pointer p-3 rounded-full" htmlFor="r1">
          <input type="checkbox" id="r1" className="peer relative appearance-none w-5 h-5 xl:w-[1.3rem] xl:h-[1.3rem] border rounded-[3px] border-blue-gray-200 cursor-pointer transition-all before:content[''] before:block before:bg-blue-gray-500 before:w-12 before:h-12 before:rounded-full before:absolute before:top-2/4 before:left-2/4 before:-translate-y-2/4 before:-translate-x-2/4 before:opacity-0 hover:before:opacity-10 before:transition-opacity checked:bg-[#353C43] checked:border-[#353C43] checked:before:bg-gray-900">
  
          </input>
            <span className="text-[#FAFAFF] absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </span>
        </label>
        
        <label className={`text-gray-700 hover:text-[#0094FF] select-none cursor-pointer ${Size.MEDIUM}`} htmlFor="r1">Soy medico</label>
      </div>
    )
}