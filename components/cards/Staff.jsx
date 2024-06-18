import { useMemo, useRef, useState } from 'react'
import { ProfileIcon } from '../../components/pages/settings/menuIcons'
import { ArrowRight } from 'components/svg'
import router from 'next/router'
import { useTranslation } from 'i18n'
import cls from './style.module.scss'
const Staff = ({ el }) => {
    const ScrollBody = useRef(null)
    const [windowWidth] = useWindowSize()
    const [currentScroll, setCurrentScroll] = useState(0)
    const [showArrow, setShowArrow] = useState(false)

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    const scrollTo = (direction) => {
        if (direction === 'right') {
            ScrollBody.current.scrollLeft += windowWidth.toString()
            setCurrentScroll((ScrollBody.current.scrollLeft += windowWidth[0]))
        } else {
            ScrollBody.current.scrollLeft -= windowWidth.toString()
            setCurrentScroll((ScrollBody.current.scrollLeft -= windowWidth[0]))
        }
    }
    const List = useMemo(() => {
        if (!el?.staffs?.length) return []

        const list = el.staffs
        let mergedObjects = {
            // position: [],
        }

        list?.forEach((object) => {
            if (mergedObjects[object.staff.slug]) {
                mergedObjects[object.staff.slug].position.push(object.child)
            } else {
                mergedObjects[object.staff.slug] = {
                    ...object,
                    position: [object.staff.position],
                }
            }
        })

        return (mergedObjects = Object.values(mergedObjects))
    }, [el])

    return (
        <div
            className="relative group"
            onMouseEnter={() => setShowArrow(true)}
            onMouseLeave={() => setShowArrow(false)}
        >
            <div
                ref={ScrollBody}
                className={`flex overflow-x-scroll scroll-body-smooth space-x-4 wrapper relative ${cls.staffList}`}
            >
                {List?.map((item, ind) => (
                    <div
                        key={item?.staff?.id}
                        className="hover:scale-110 duration-300"
                        onClick={() => {
                            router.push(`/actor/${item?.staff?.slug}`)
                        }}
                    >
                        <div className="w-[128px] h-[128px] rounded-[12px] border-[4px] border-mainColor bg-mainColor flex items-center justify-center overflow-hidden cursor-pointer">
                            {item?.staff?.photo ? (
                                <img
                                    src={item?.staff?.photo}
                                    alt={item?.staff?.first_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ProfileIcon
                                    width="32"
                                    height="32"
                                    stroke="#666086"
                                />
                            )}
                        </div>
                        <p className="w-[128px] text-[#D9D8E0] text-xl font-medium mt-2 break-words">
                            <span>{item?.staff?.first_name}</span>
                            <span> {item?.staff?.last_name}</span>
                        </p>
                    </div>
                ))}
            </div>
            <div
                onClick={() => scrollTo('right')}
                className={`absolute right-0 top-0 cursor-pointer h-[100%] flex items-center duration-300 from-black bg-gradient-to-l ${
                    showArrow &&
                    windowWidth[0] !== currentScroll &&
                    el?.staffs?.length >= 12
                        ? 'opacity-[1]'
                        : 'opacity-0'
                }`}
            >
                <div className="mb-20">
                    <ArrowRight width="60" height="60" />
                </div>
            </div>
            <div
                onClick={() => scrollTo('left')}
                className={`rotate-180 absolute left-0 top-0 cursor-pointer h-[65%] flex items-center duration-300 ${
                    showArrow && currentScroll > 0 ? 'opacity-[1]' : 'opacity-0'
                }`}
            >
                <ArrowRight className="rotate-[20deg]" width="60" height="60" />
            </div>
        </div>
    )
}

export default Staff
