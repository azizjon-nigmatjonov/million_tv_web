import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, CarouselRightArrow } from 'components/svg'
import Image from 'next/image'
import Actor from 'components/cards/Actor'
import ActorImg from '../../public/images/actor.png'

const ScrollList = ({ title = 'Movies', movie = true }) => {
    const ScrollBody = useRef(null)
    const [currentScroll, setCurrentScroll] = useState(0)
    const [maxScroll, setMaxScroll] = useState(0)

    const scroll = (left) => {
        const visibleDivWidth = ScrollBody.current.clientWidth

        if (left) {
            setCurrentScroll((ScrollBody.current.scrollLeft += visibleDivWidth))
            ScrollBody.current.scrollLeft += visibleDivWidth
        } else {
            setCurrentScroll((ScrollBody.current.scrollLeft -= visibleDivWidth))
            ScrollBody.current.scrollLeft -= visibleDivWidth
        }
    }

    useEffect(() => {
        setMaxScroll(ScrollBody.current.scrollLeftMax)
    }, [])

    return (
        <div className="division bg-black  relative">
            <div className="md:mb-8 flex items-end text-white">
                <h2 className="division-title">{title}</h2>
            </div>
            <div className="group">
                <div
                    ref={ScrollBody}
                    className="section-body-scroll py-5 flex space-x-2 h-auto md:space-x-[32px] items-start"
                >
                    {/* {stories.map((story, index) => {
                    return <Story key={index} story={story} />
                })} */}
                    {/* <Story key={'story_id_1'} story={{ */}
                    {[
                        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    ].map((index) => (
                        <Actor
                            AvatarImg={ActorImg}
                            key={index}
                            name="Кристофер"
                            text="режиссёр"
                        />
                    ))}
                </div>
                {currentScroll > 0 && (
                    <div className="scroll-arrow px-4 left=[-16px] md:left-[-95px] bg-gradient-to-r  from-black to-transparent group-hover:opacity-100">
                        <button
                            type="button"
                            className="transform rotate-180 cursor-pointer mt-6"
                            // onClick={ScrollAction}
                            onClick={() => scroll(false)}
                        >
                            <CarouselRightArrow />
                        </button>
                    </div>
                )}
                {/* Scroll to right */}
                {maxScroll + 10 > currentScroll && (
                    <div className="scroll-arrow right-[-16px] md:right-[-95px] px-4 justify-end bg-gradient-to-l  from-black to-transparent group-hover:opacity-100">
                        <button
                            type="button"
                            className="cursor-pointer mt-6"
                            // onClick={ScrollAction}
                            onClick={() => scroll(true)}
                        >
                            <CarouselRightArrow />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ScrollList
