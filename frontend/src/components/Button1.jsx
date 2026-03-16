import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

import { Size, SizeBox, CButton, Background } from "../styles/Styles";

export function Button1({nombre, id, type, link, color, className=""}) {
    if (type === 'link'){
        return (
            <Link to={link} className="flex items-center justify-center w-auto h-[40px] md:h-[38px] xl:h-[3.5rem] text-center mr-2">
                <Button 
                    id={id} 
                    className={`${className} w-full px-5 h-full flex items-center justify-center font-[sansation-regular] text-white ${color} hover:bg-gradient-to-bl rounded-full ${Size.LARGE} normal-case drop-shadow-md`}
                >
                    {nombre}
                </Button>
            </Link>
        )
    }else{
        return (
            <Button 
                type={type} 
                id={id} 
                className={`w-auto px-5 h-[40px] md:h-[38px] xl:h-[3.5rem] text-center mr-2 font-[sansation-regular] text-white ${color} hover:bg-gradient-to-bl rounded-full ${Size.LARGE} py-2 normal-case drop-shadow-md whitespace-nowrap`}
            >
                {nombre}
            </Button>
        )
    }
}