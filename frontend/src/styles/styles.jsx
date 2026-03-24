//Tamaños fuente
const Size = {
    SMALL: 'text-[0.5em]',
    MEDIUM: 'text-[1em]',
    LARGE: 'text-[1.3em]',
    EXTRALARGE: 'text-[1.5em]',
    EXTRALARGE2: 'text-[2.5em]',
}

//Screens
const SizeBox = {
    BOX_L: 'w-[350px] h-[500px] md:h-[550px] md:w-[450px] lg:w-[78%] xl:h-[670px] min-w-[260px] min-h-[500px] max-w-[1220px]',
    BOX_R: 'w-[350px] lg:w-[700px] lg:max-w-full min-w-[300px] h-[500px] lg:h-auto',
}

//Fondos
const Background = {
    BACKGROUND: 'flex flex-col justify-center items-center text-center min-w-fit min-h-screen p-10 bg-[url("src/assets/backglogin_3.jpeg")] bg-cover bg-center lg:bg-[url("src/assets/backglogin_3.jpeg")]',
    BACKGROUNDR: 'flex flex-col justify-center items-center min-w-fit min-h-screen p-10 overflow-auto bg-[url("src/assets/fondoreg1.png")] bg-cover bg-center bg-scroll'
}

//Styles - button
const CButton = {
    GRADIENT: 'bg-gradient-to-r from-[#0094FF] to-[#00E0FF]',
    MATE: 'bg-[#353C43]'
}

export {Size, Background, SizeBox, CButton}