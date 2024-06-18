import cls from './style.module.scss'
import NextLink from 'components/common/link'
export default function BannerElementTitle({ element }) {
    return (
        <div
            className={`${cls.responsive_banner_content} z-[4] w-full wrapper text-center`}
        >
            <div className="flex flex-col items-center">
                {element?.movie_logo_title && (
                    <img
                        src={element?.movie_logo_title}
                        alt="img"
                        className="w-[250px]"
                    />
                )}
                <NextLink
                    href={`/movie/${element?.slug}?from=${element?.category?.id}`}
                >
                    <div>
                        <span
                            className="text-3xl font-semibold text-[#ffffff]"
                            id="bannerTitle"
                        >
                            {element?.title}
                        </span>
                        <div className="flex items-center justify-center md:hidden mt-[12px]">
                            {element?.genres?.length > 0 && (
                                <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                    {element?.genres[0]?.title}
                                </p>
                            )}
                            {element?.genres?.length === 2 && (
                                <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                    {element?.genres[1]?.title}
                                </p>
                            )}
                            <p className="text-[#E9E9E9] text-7 leading-10 font-normal mx-1">
                                •
                            </p>
                            <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                {element?.release_year}
                            </p>
                            <p className="text-[#E9E9E9] text-7 leading-10 font-normal mx-1">
                                •
                            </p>
                            <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                {element?.country}
                            </p>
                            <p className="text-[#E9E9E9] text-7 leading-10 font-normal mx-1">
                                •
                            </p>
                            <div className="ring-1 ring-border-xl ring-[#E9E9E9] px-1 rounded ml-1">
                                <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                    +
                                    {element?.age_restriction
                                        ? element?.age_restriction
                                        : 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </NextLink>
            </div>
        </div>
    )
}
