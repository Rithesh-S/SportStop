import React from "react";

function Spinner() 
{
    return(
    <>
        <section className="h-dvh flex justify-center items-center ">
            <span className="relative flex h-7 w-7">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-7 w-7 bg-blue-500"></span>
            </span>
        </section>
    </>
    )
}

export default Spinner