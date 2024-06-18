import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, CarouselRightArrow } from 'components/svg'
import Movie from 'components/cards/Movie'
import MovieImg from '../../public/images/movie.png'

const ScrollSection = ({ title = 'Movies', movie = true }) => {
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

    const [windowWidth] = useWindowSize()
    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    return (
        <div className="section bg-black  relative">
            <div className="md:mb-8 flex items-end text-white">
                <h2 className="section-header">{title}</h2>
                <div className="flex group cursor-pointer">
                    <span className="hidden w-0 group-hover:flex group-hover:w-[122px] font-normal text-10 self-end ml-2">
                        открыть все
                    </span>
                    <span className="show-all-icon">
                        <ArrowRight
                            width={windowWidth < 600 ? '24' : '32'}
                            height={windowWidth < 600 ? '24' : '32'}
                        />
                    </span>
                </div>
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
                    {movie &&
                        [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            16,
                        ].map((index) => (
                            <Movie key={index} text="dsf" MovieImg={MovieImg} />
                        ))}
                </div>
                {currentScroll > 0 && (
                    <div className="scroll-arrow px-4 bg-gradient-to-r from-black to-transparent group-hover:opacity-100">
                        <button
                            type="button"
                            className="transform rotate-180 cursor-pointer mt-6"
                            // onClick={ScrollAction}
                            onClick={() => scroll(false)}
                        >
                            {/* <CarouselRightArrow /> */}
                        </button>
                    </div>
                )}
                Scroll to right
                {maxScroll + 10 > currentScroll && (
                    <div className="scroll-arrow right-0 px-4 justify-end bg-gradient-to-l from-black to-transparent group-hover:opacity-100">
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

export default ScrollSection
