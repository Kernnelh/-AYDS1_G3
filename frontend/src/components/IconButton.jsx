import { Button } from "@material-tailwind/react";

export const IconButton = ({ id, icon, style }) => {
    return (
        <Button
            type="button"
            id={id}
            className={`${style} flex items-center justify-center bg-transparent shadow-none`}
        >
            {icon}
        </Button>
    );
};