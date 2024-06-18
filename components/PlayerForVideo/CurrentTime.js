import React from 'react'

export default function CurrentTime({ leftTime, isTv = false }) {
    return (
        <div className={`currentTime flex items-center mt-6`}>
            {isTv && (
                <div className="mr-[-5px] text-[15px] text-red-600 flex items-center">
                    <div className="w-[12px] h-[12px] rounded-full bg-red-600 mr-[6px]"></div>
                    В эфире
                </div>
            )}
            {!isTv && <>- {leftTime}</>}
        </div>
    )
}
