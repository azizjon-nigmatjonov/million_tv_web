import React, { useState, useEffect, useMemo } from 'react'
import MobileBanner from './MobileBanner'
import DesktopBanner from './DesktopBanner'
import { useMobile } from 'hooks/useMobile'
import { parseCookies } from 'nookies'
import { useSelector } from 'react-redux'
import { useTranslation } from 'i18n'
import OptimizeQuery2 from 'utils/optimizeQuery2'
import axios from 'utils/axios'

const Banner = ({ banners, setLoading = () => {} }) => {
    const ipod = useMobile('ipod')
    const { profile_id } = parseCookies()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const { i18n } = useTranslation()
    const [favouriteList, setFavouriteList] = useState([])

    function getFavourites() {
        const obj = {
            lang: i18n?.language,
            limit: 500,
            page: 1,
        }
        axios
            .get(
                `/favourites/profile/${
                    CurrentUserData?.id ? CurrentUserData?.id : profile_id
                }?${OptimizeQuery2(obj)}`,
            )
            .then((res) => {
                setFavouriteList(res?.data?.favourites)
            })
    }

    useEffect(() => {
        getFavourites()
    }, [])

    const moviesList = useMemo(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1500)
        let result = []
        if (!banners?.movies?.length) return result
        if (favouriteList?.length) {
            banners.movies.map((item) => {
                favouriteList.map((element) => {
                    if (item.id === element.movie_id) {
                        item.is_favourite = true
                    }
                })
                result.push(item)
            })
        } else result = banners.movies
        return result
    }, [banners, favouriteList, setLoading])

    const list = useMemo(() => {
        if (!moviesList.length) return []
        const news = banners?.news?.map((item) => ({
            title: item.title,
            link: item.link,
            is_news: true,
            file_info: {
                image: item.image,
            },
            slogan: item.text,
            trailer: [
                {
                    image: item.image,
                    videos: [{ quality: '1080', file_name: item.video }],
                },
            ],
            ...item,
        }))

        const movies = moviesList
        setLoading(false)
        let data = [...(movies ? movies : []), ...(news ? news : [])]
        return data ?? []
    }, [banners, moviesList, setLoading])

    return (
        <>
            {ipod ? (
                <div className="banner_gradiend">
                    <MobileBanner movies={list} />
                </div>
            ) : (
                <DesktopBanner list={list} />
            )}
        </>
    )
}

export default Banner
