import SEO from 'components/SEO'
import Banner from 'components/mainPage/Banner'
import ScrollComponent from 'components/scroll/Scrollcomponent'
import { useTranslation } from 'i18n'
import MoviesHistory from 'components/scroll/MoviesHistory'
import { parseCookies } from 'nookies'
import axios from 'utils/axios'
import { setProfilesList } from 'store/actions/application/profilesAction'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Router } from 'i18n'
import { setProfile } from 'store/actions/application/profileAction'
import InfiniteScroll from 'react-infinite-scroll-component'
import SkeletonHomePage from 'components/mainPage/Skeleton'

export default function Home() {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [recommendMovies, setRecommendMovies] = useState()
    const RecommendationActive = useSelector(
        (state) => state.recommend.recommendation_active,
    )
    const profile = useSelector((state) => state.mainProfile.profile_value)
    const ProfilesList = useSelector((state) => state.profile.profiles_list)
    const listSelected = sessionStorage.getItem('listSelected')
    const userActivation = sessionStorage.getItem('userActivation')
    const { session_id, profile_id } = parseCookies()
    const [featured_lists, setFeaturedLists] = useState([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [movies, setMovies] = useState()
    const [currentPageBanner, setCurrentPageBanner] = useState(1)

    const [channelslist, SetChannelsList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session_id) {
            if (profile && profile?.access_token) {
                if (!userActivation || userActivation == 'false') {
                    axios
                        .post(`count-platform`, {
                            platform_name: 'Веб-сайт',
                        })
                        .then(() => {
                            sessionStorage.setItem('userActivation', 'active')
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                }
            }
        }
    }, [profile, userActivation])

    useEffect(() => {
        axios
            .get(`tv/channel`)
            .then((response) => {
                SetChannelsList(response?.data?.tv_channels)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    useEffect(() => {
        if (session_id) {
            axios
                .get('/customer/profile')
                .then((response) => {
                    dispatch(setProfile(response?.data?.customer))
                })
                .catch((error) => {
                    console.error(error)
                })
        } else {
            dispatch(setProfile(null))
        }
    }, [session_id])

    const getRecentlyWatchedMovies = () => {
        if (session_id)
            axios
                .get(
                    `recently-watched-movies?SessionId=${session_id}&profile_id=${
                        CurrentUserData ? CurrentUserData?.id : profile_id
                    }&lang=${i18n?.language}&page=${1}&limit=${20}`,
                )
                .then((res) => {
                    setCount(res?.data?.count)
                    setMovies(res?.data?.user_movies)
                })
    }

    const deleteRecenlyWatchedMovie = (id) => {
        axios
            .delete(
                `recently-watched-movies?profile_id=${
                    CurrentUserData ? CurrentUserData?.id : profile_id
                }`,
                {
                    data: {
                        movie_key: id,
                    },
                },
            )
            .then(() => {
                setTimeout(() => {
                    getRecentlyWatchedMovies()
                }, 0)
            })
    }

    useEffect(() => {
        if (i18n?.language) {
            const params = {}
            params.age_restriction =
                CurrentUserData?.profile_type === 'children'
                    ? CurrentUserData?.profile_age
                    : undefined
            ;(params.page = currentPageBanner),
                (params.lang = i18n.language),
                // (params.limit = 100),
                axios.get(`/featured-list`, { params }).then((response) => {
                    setFeaturedLists((items) => [
                        ...items,
                        ...response?.data?.featured_lists,
                    ])
                })
        }
        getRecentlyWatchedMovies()
    }, [CurrentUserData, currentPageBanner, i18n])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
        })
    }
    useEffect(() => {
        scrollToTop()
    }, [CurrentUserData])

    useEffect(() => {
        if (session_id) {
            if (profile?.access_token) {
                if (ProfilesList && ProfilesList?.count > 1) {
                    if (!listSelected && listSelected !== 'active') {
                        if (!RecommendationActive) {
                            setTimeout(() => {
                                location.replace('/profiles')
                            }, 1000)
                        }
                    }
                }
            }
        }
    }, [])

    useEffect(() => {
        if (session_id) {
            axios
                .get('/profiles', {
                    headers: {
                        SessionId: session_id,
                    },
                })
                .then((res) => {
                    dispatch(setProfilesList(res?.data ? res?.data : null))
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [CurrentUserData])

    useEffect(() => {
        if (
            CurrentUserData &&
            i18n?.language &&
            CurrentUserData?.favourite_genres &&
            CurrentUserData?.profile_type !== 'children' &&
            session_id
        ) {
            axios
                .get('/movies', {
                    params: {
                        genre: CurrentUserData?.favourite_genres,
                        lang: i18n?.language,
                    },
                })
                .then((res) => {
                    setRecommendMovies(res?.data)
                })
        } else {
            setRecommendMovies(null)
        }
    }, [CurrentUserData, i18n])

    useEffect(() => {
        if (session_id) {
            if (profile && profile?.session_status === false) {
                setTimeout(() => {
                    Router.push('/session-limit-ended?status=offline')
                }, 400)
            }
        }
    }, [profile, session_id, featured_lists])

    return (
        <>
            <SEO />
            {loading && <SkeletonHomePage />}

            <>
                <div>
                    <Banner
                        banners={
                            featured_lists?.find(
                                (el) => el.slug === 'banner',
                            ) ?? []
                        }
                        setLoading={setLoading}
                    />

                    {movies && (
                        <MoviesHistory
                            movies={movies}
                            count={count}
                            page={page}
                            deleteRecenlyWatchedMovie={
                                deleteRecenlyWatchedMovie
                            }
                            linkToPage={'/settings?from=watched-history'}
                        />
                    )}

                    {/* {channelslist?.length && (
                        <div className="mt-10 md:mt-0">
                            <ScrollComponent
                                additionalClassesScroll="lg:pt-10"
                                dataMovie={channelslist ?? []}
                                type="tv"
                                title={t('allChannels')}
                                linkToPage={'/tv'}
                                imgWidth="h-[152px] sm:h-[220px]"
                                layoutWidth="w-[108px] sm:w-[157px]"
                            />
                        </div>
                    )} */}

                    {recommendMovies?.movies?.length &&
                        profile?.access_token && (
                            <div className="mt-[40px] lg:mt-0 xl:mt-0">
                                <ScrollComponent
                                    extraStyles={{ title: 'text-[#03a9f4]' }}
                                    dataMovie={recommendMovies?.movies}
                                    type="recommendation"
                                    title={
                                        CurrentUserData?.name
                                            ? CurrentUserData?.name
                                            : ''
                                    }
                                    extraTitle={
                                        <span className="text-white">
                                            {t('recommendYou')}
                                        </span>
                                    }
                                    linkToPage={
                                        '/movies/recommandation?type=user'
                                    }
                                    imgWidth="h-[152px] sm:h-[220px]"
                                />
                            </div>
                        )}

                    <InfiniteScroll
                        dataLength={featured_lists?.length || 0}
                        style={{ overflow: 'visible' }}
                        next={() => {
                            setCurrentPageBanner((pre) => ++pre)
                        }}
                        hasMore={true}
                    >
                        {featured_lists?.length && (
                            <div
                                className={
                                    recommendMovies?.movies ? '' : 'mt-[50px]'
                                }
                            >
                                {featured_lists
                                    ?.filter((el) => el.slug !== 'banner')
                                    .map((elem) => {
                                        return (
                                            <ScrollComponent
                                                dataMovie={elem.movies}
                                                type="movie"
                                                title={
                                                    elem.movies.length > 0
                                                        ? elem.title
                                                        : ''
                                                }
                                                linkToPage={`/movies/${elem.slug}?lang=${elem.lang}&featured=true`}
                                                key={elem.id}
                                                additionalClassesScroll="mt-8"
                                                imgWidth="sm:h-[220px]"
                                            />
                                        )
                                    })}
                            </div>
                        )}
                    </InfiniteScroll>
                </div>
            </>
        </>
    )
}
