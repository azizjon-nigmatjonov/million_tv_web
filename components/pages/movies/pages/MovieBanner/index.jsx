import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import MovieBannnerRecommand from './Recommand'
import MovieBannerMovies from './Movies'
export default function MovieBannerPageWrapper({ CurrentUserData }) {
    const router = useRouter()
    const bannerText = useSelector((state) => state.bannerData.banner_text)
    const featuredActive = useMemo(() => {
        return router?.query?.featured
    }, [router])
    return (
        <>
            <div className="md:w-1/2 text-white mt-5 mb-8">
                <h1 className="text-[22px] sm:text-[34px] font-bold wrapper">
                    {bannerText}
                </h1>
            </div>
            {featuredActive ? (
                <MovieBannerMovies CurrentUserData={CurrentUserData} />
            ) : (
                <MovieBannnerRecommand CurrentUserData={CurrentUserData} />
            )}
        </>
    )
}
