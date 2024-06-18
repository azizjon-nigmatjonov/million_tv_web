import { Router } from 'i18n'
import cls from './Story.module.scss'

const Actor = ({ elm, imgLink, text, name, categories }) => {
    return (
        <div
            onClick={() => Router.push(`/actor/${elm.staff.slug}`)}
            className={`w-[70px] flex justify-center align-center h-[121px] text-center md:w-[112px] md:h-auto overflow:visible text-white transform md:hover:scale-105 transition  duration-500 ease-in-out ${cls.actorsCard}`}
        >
            <a
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <div className="rounded-full flex justify-center align-center md:w-[64px] ">
                    <img
                        className="rounded-full w-[64px] h-[64px] object-cover flex-1 actor_images"
                        src={imgLink}
                        width={112}
                        height={112}
                        alt="actor"
                    />
                </div>
                <span
                    className="font-semibold block mt-2 actor-text-dots text-left text-[13px] leading-[18px] max-w-[64px]"
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        webkitLineClamp: 2,
                    }}
                >
                    {name}
                </span>
                <span className="text-[11px] leading-[13px] text-textGray block text-left w-full mt-[4px]">
                    {text}
                </span>
            </a>
        </div>
    )
}

export default Actor
