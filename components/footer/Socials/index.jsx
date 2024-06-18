import {
    FacebookIconFill,
    TelegramIconFill,
    YoutubeIconFill,
    TiktokFill,
    InstagramIcon,
} from 'components/svg'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export default function FooterSocials() {
    const router = useRouter()
    const list = useMemo(() => {
        const result = [
            {
                icon: <InstagramIcon />,
                link: '#',
            },
            {
                icon: <FacebookIconFill />,
                link: '#',
            },
            // {
            //     icon: <TelegramIconFill />,
            //     link: '#',
            // },

            // {
            //     icon: <YoutubeIconFill />,
            //     link: '#',
            // },
            // {
            //     icon: <TiktokFill />,
            //     link: '#',
            // },
        ]
        return result
    }, [])
    return (
        <ul
            className={`${
                router.pathname === '/' && 'mb-9'
            } flex items-center gap-4 flex-wrap pb-[20px] md:pb-0`}
        >
            {list?.map((item, index) => (
                <li key={index}>
                    <a
                        href={item.link}
                        className="bg-[#111B33] hover:scale-110 hover:bg-opacity-[0.2] duration-200 w-[55px] h-[55px] flex flex-wrap items-center justify-center rounded-full"
                    >
                        {item.icon}
                    </a>
                </li>
            ))}
        </ul>
    )
}
