import React from 'react'

function Info({ title, text, icon }) {
    return (
        <div className="flex justify-center items-center flex-col py-[20px]">
            <span>{icon}</span>
            <h2 className="text-[20px] leading-[28px] mt-[16px] mb-2 font-medium text-center">
                {title}
            </h2>
            <p className="text-[15px] leading-[20px]">{text}</p>
        </div>
    )
}

export default Info
