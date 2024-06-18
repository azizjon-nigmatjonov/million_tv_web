import React from 'react'

export default function PassedTime({ passedTime, isTv = false }) {
    return (
        <div
            className={`PassedTime flex items-center ${isTv ? 'mt-2' : 'mt-6'}`}
        >
            {isTv && (
                <div className="mr-2 text-[15px] text-red-600 flex items-center">
                    <div className="w-[12px] h-[12px] rounded-full bg-red-600 mr-[6px]"></div>
                    В эфире
                </div>
            )}
            {!isTv && <>{passedTime}</>}
        </div>
    )
}
