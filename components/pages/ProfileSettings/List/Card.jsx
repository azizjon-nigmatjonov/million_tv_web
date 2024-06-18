import cls from './style.module.scss'
import pngimg from 'public/images/genre.png'
import { HeartBroke, HeartFill } from 'components/svg'
export default function ProfileSettingsCard({
    element = {},
    handleCheck = () => {},
}) {
    return (
        <div
            onClick={() => handleCheck(element.id)}
            className={`${cls.cardWrapper} ${
                element?.checked ? cls.checked : ''
            }`}
        >
            <div
                className={`${
                    element?.checked ? 'group-hover:block' : 'hidden'
                } group-hover:block absolute left-1/2 top-1/2 -translate-x-1/2 z-[2]`}
            >
                {element?.checked ? <HeartFill /> : <HeartBroke />}
            </div>
            <h1 className={cls.title}>{element.title}</h1>
            <div className={cls.image}>
                <img src={element?.image ?? pngimg.src} alt="image" />
            </div>
        </div>
    )
}
