import { useRef, createRef, useState } from 'react'
import cls from './style.module.scss'

export default function CScrollText({ text, limit = 20 }) {
    const [currentRef, setCurrentRef] = useState(null)

    const handleMouseEnter = (e) => {
        if (text?.length > limit) setCurrentRef(e?.target)
    }

    const handleMouseLeave = () => {
        setCurrentRef(null)
    }

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cls.textContainer}
        >
            {currentRef ? (
                <marquee start={false}>{text}</marquee>
            ) : (
                <p className="text oswald-family">{text}</p>
            )}
        </div>
    )
}
