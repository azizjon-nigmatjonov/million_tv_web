import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, CarouselRightArrow } from 'components/svg'
import Movie from 'components/cards/Movie'
import Actor from 'components/cards/Actor'
import SelectedMovie from 'components/cards/SelectedMovie'
import Trailer from 'components/cards/Trailer'
import Subscription from 'components/cards/Subscription'
import TvChannel from 'components/cards/TvChannel'
import SelectedImg from '../../public/images/Poster.png'
import MovieImg from '../../public/images/movie.png'
import MovieImg2 from '../../public/images/movie2.png'
import Cartoon1 from '../../public/images/cartoon1.png'
import Cartoon2 from '../../public/images/cartoon2.png'
import Serial1 from '../../public/images/serial.png'
import moment from 'moment'
import { useTranslation } from 'i18n'
import LastMovie from 'components/cards/LastMovie'
import { Router } from 'i18n'
import CommentsComponent from 'components/cards/Comments'
import { setMoviesTabCurrent } from 'store/actions/application/moivesTabActions'
import { useDispatch } from 'react-redux'
import { setBannerTexts } from 'store/actions/application/bannerActions'
import styles from './styles.module.scss'

const ScrollComponent = ({
    type,
    title,
    extraTitle = '',
    linkToPage,
    additionalClasses = '',
    additionalClassesScroll,
    bodyClass,
    dataMovie,
    el,
    showFeedbackForm,
    categories,
    feedbackData,
    profile,
    setShowFeedbackForm,
    text,
    checkSubscription,
    subscription,
    purchase,
    setTvotModal,
    setBuyFreeTrail,
    tvotModal,
    setFeedbacksData,
    feedbacks,
    trailerPorperties,
    paddingTrailer,
    seasonsProperty,
    megogoType,
    setCurrentPage,
    imgWidth,
    setTab,
    extraStyles,
}) => {
    const ScrollBody = useRef(null)
    const [currentScroll, setCurrentScroll] = useState(0)
    const [maxScroll, setMaxScroll] = useState(0)
    const [season, setSeason] = useState(1)
    const { t, i18n } = useTranslation()
    const [freeTrailExpired, setFreeTrailExpired] = useState([])
    const [windowWidth] = useWindowSize()
    const dispatch = useDispatch()
    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    const scroll = (left) => {
        const visibleDivWidth = ScrollBody.current.clientWidth

        if (left) {
            if (type === 'megogo') {
                setCurrentPage((pre) => ++pre)
            }
            if (type === 'premier') {
                setCurrentPage((pre) => ++pre)
            }
            if (type === 'feedbacks') {
                setCurrentPage((pre) => ++pre)
            }
            setCurrentScroll((ScrollBody.current.scrollLeft += visibleDivWidth))
            ScrollBody.current.scrollLeft += visibleDivWidth
        } else {
            setCurrentScroll(
                (ScrollBody.current.scrollLeft =
                    visibleDivWidth - ScrollBody.current.scrollLeft),
            )
            ScrollBody.current.scrollLeft -= visibleDivWidth
        }
    }
    useEffect(() => {
        setMaxScroll(ScrollBody?.current?.scrollWidth)
    }, [])

    useEffect(() => {
        if (checkSubscription?.message === 'FREE_TRIAL_EXPIRED') {
            function getTvSingleCategoryBySubscriptionId(
                category,
                subscription_id,
            ) {
                if (Array.isArray(category) && category?.length > 0) {
                    for (let i = 0; i < category?.length; i++) {
                        for (
                            let j = 0;
                            j < category[i].subscriptions?.length;
                            j++
                        ) {
                            if (
                                category[i].subscriptions[j].id ===
                                subscription_id
                            ) {
                                let res = {
                                    id: category[i].id,
                                    title_ru: category[i].title_ru,
                                    title_en: category[i].title_en,
                                    title_uz: category[i].title_uz,
                                    description_ru: category[i].description_ru,
                                    description_en: category[i].description_en,
                                    description_uz: category[i].description_uz,
                                    status: category[i].status,
                                    subscriptions: [],
                                }
                                res.subscriptions.push(
                                    category[i].subscriptions[j],
                                )
                                return res
                            }
                        }
                    }
                }
            }
            setFreeTrailExpired(
                getTvSingleCategoryBySubscriptionId(
                    el,
                    checkSubscription.subscription_id,
                ),
            )
        }
    }, [checkSubscription])

    const handleRedirect = () => {
        if (setTab) {
            dispatch(setMoviesTabCurrent(setTab))
        }
        if (linkToPage) {
            dispatch(setBannerTexts(title))
            Router.push(linkToPage)
        }
    }

    return (
        <div
            className={`relative ${
                additionalClassesScroll ? additionalClassesScroll : ''
            } ${dataMovie?.length > 0 ? '' : 'mt-0'}`}
        >
            <div className="wrapper group flex items-center justify-between md:justify-start md:mb-1 text-white svg-parent">
                {linkToPage && title?.length > 0 ? (
                    <div onClick={() => handleRedirect()}>
                        <a>
                            <h2
                                className={`section-title cursor-pointer mt-0 ml-0 oswald-family ${extraStyles?.title}`}
                            >
                                {title} {extraTitle}
                            </h2>
                        </a>
                    </div>
                ) : (
                    title?.length > 0 && (
                        <h2
                            className="section-title cursor-pointer mt-0 oswald-family"
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                    )
                )}
                {linkToPage && title?.length > 0 && (
                    <div onClick={() => handleRedirect()}>
                        <a>
                            <div className="flex items-center cursor-pointer justify-center">
                                <span
                                    className={` oswald-family text-transparent -translate-y-0.5 w-0 h-6 sm:group-hover:flex group-hover:w-[100%] group-hover:h-7 overflow-hidden group-hover:text-[#fff] transform duration-500 ease-in-out font-normal text-10 self-end ml-2 hidden sm:block`}
                                >
                                    {t('open_all')}
                                </span>
                                <span
                                    className={`show-all-icon sm:translate-y-0.5 ${
                                        windowWidth < 600
                                            ? 'absolute right-[16px]'
                                            : ''
                                    }`}
                                >
                                    <ArrowRight
                                        width={windowWidth < 600 ? '24' : '32'}
                                        height={windowWidth < 600 ? '24' : '32'}
                                    />
                                </span>
                            </div>
                        </a>
                    </div>
                )}

                <div className="flex">
                    {type === 'season' &&
                        el?.seasons?.map((elm, ind) => (
                            <div key={ind} className="flex mr-4 space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setSeason(ind + 1)}
                                    className={`cursor-pointer hover:bg-mainColor h-[48px] w-[48px] color-white flex items-center justify-center text-[18px] font-medium rounded-full ${
                                        elm.episodes?.length > 0 ? '' : 'hidden'
                                    } ${
                                        season === ind + 1
                                            ? 'bg-mainColor'
                                            : 'bg-greyColor'
                                    }`}
                                >
                                    {ind + 1}
                                </button>
                            </div>
                        ))}
                </div>
            </div>
            <div
                className={`flex scroll overflow-scroll md:overflow-x-auto flex-nowrap gap-[16px] pl-[16px] md:mt-0 md:pl-[56px] md:min-w-[700px] lg:flex-wrap ${
                    paddingTrailer ? paddingTrailer : ''
                }`}
            >
                {type === 'trailer' &&
                    el.trailer?.map((elm, ind) => (
                        <div key={ind}>
                            {el.is_mogago ? (
                                elm.quality === '720p' &&
                                elm.quality?.length > 0 && (
                                    <div>
                                        <Trailer
                                            ind={ind}
                                            elm={el}
                                            text="Trailer film"
                                            imgSrc={elm?.image?.big}
                                            trailerPorperties={
                                                trailerPorperties
                                            }
                                        />
                                    </div>
                                )
                            ) : (
                                <div>
                                    <Trailer
                                        ind={ind}
                                        elm={el}
                                        text="Trailer film"
                                        imgSrc={elm.image}
                                        trailerPorperties={trailerPorperties}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
            </div>

            <div
                className={`scroll-wrapper ${
                    el?.length > 6 || dataMovie?.length > 6
                        ? 'group'
                        : '' || type === 'season'
                        ? 'group'
                        : ''
                }`}
            >
                <div
                    onScroll={() => {
                        setMaxScroll(
                            ScrollBody?.current?.scrollWidth -
                                ScrollBody?.current?.clientWidth,
                        )
                        setCurrentScroll(ScrollBody?.current?.scrollLeft)
                    }}
                    ref={ScrollBody}
                    className={`${
                        styles.cards
                    } scroll-body my-3 sm:my-5 flex space-x-2 sm:space-x-5 ${
                        dataMovie?.length > 0 && type !== 'tv'
                            ? 'sm:h-[300px]'
                            : ''
                    } items-center ${bodyClass} ${
                        type === 'season' ? 'space-x-4' : 'space-x-2'
                    }`}
                >
                    {type === 'movie' &&
                        dataMovie?.map((elm, i) => (
                            <Movie
                                el={elm}
                                key={i}
                                text="kino"
                                MovieImg={MovieImg}
                                imgWidth={imgWidth}
                                layoutWidth="w-[108px] sm:w-[157px]"
                                megogoType={megogoType ? megogoType : null}
                            />
                        ))}
                    {type === 'serial' &&
                        [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            16,
                        ].map((_, i) => (
                            <div key={i}>
                                <Movie text="kino" MovieImg={Serial1} />
                                <Movie text="kino" MovieImg={MovieImg2} />
                            </div>
                        ))}
                    {type === 'cartoon' &&
                        [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            16,
                        ].map((_, i) => (
                            <div key={i}>
                                <Movie text="kino" MovieImg={Cartoon1} />
                                <Movie text="kino" MovieImg={Cartoon2} />
                            </div>
                        ))}
                    {type === 'actor' &&
                        el.staffs?.map((elem, ind) =>
                            !elem.is_megago && elem.position ? (
                                <Actor
                                    categories={categories}
                                    elm={elem}
                                    key={ind}
                                    text={
                                        (elem.position === 'actor' &&
                                            'Актёр') ||
                                        (elem.position === 'director' &&
                                            'Режиссер') ||
                                        (elem.position === 'producer' &&
                                            'Продюсер')
                                    }
                                    imgLink={
                                        elem.staff.photo
                                            ? elem.staff.photo
                                            : '../vectors/movie-image-vector.svg'
                                    }
                                    name={`${elem.staff.first_name} ${elem.staff.last_name}`}
                                />
                            ) : (
                                <Actor
                                    categories={categories}
                                    elm={elem}
                                    key={ind}
                                    text={
                                        (elem.type === 'ROLE' && 'Актёр') ||
                                        (elem.type === 'ANNOUNCER' &&
                                            'Дикторы') ||
                                        (elem.type === 'ARTIST' &&
                                            'Художники') ||
                                        (elem.type === 'ASSEMBLY' &&
                                            'Монтаж') ||
                                        (elem.type === 'AUTHOR' && 'Авторы') ||
                                        (elem.type === 'COMPOSER' &&
                                            'Композиторы') ||
                                        (elem.type === 'PRODUCER' &&
                                            'Продюсеры') ||
                                        (elem.type === 'SCENARIO' &&
                                            'Сценаристы') ||
                                        (elem.type === 'PERSONAGE' &&
                                            'Персонажи') ||
                                        (elem.type === 'TEAM' && 'Команды') ||
                                        (elem.type === 'CYPRESS_TEST_AUTO' &&
                                            'qa_test_dont')
                                    }
                                    imgLink={
                                        elem.avatar.image_240x240
                                            ? elem.avatar.image_240x240
                                            : '../vectors/movie-image-vector.svg'
                                    }
                                    name={`${elem.name}`}
                                />
                            ),
                        )}
                    {type === 'selected' &&
                        [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            16,
                        ].map((index, ind) => (
                            <SelectedMovie
                                key={ind}
                                text="Фильмы про настоящих безумцев"
                                imgSrc={SelectedImg}
                            />
                        ))}
                    {type === 'subscription' &&
                        (checkSubscription?.message === 'FREE_TRIAL_EXPIRED' ? (
                            <div>
                                <Subscription
                                    checkSubscription={checkSubscription}
                                    setBuyFreeTrail={setBuyFreeTrail}
                                    text_btn={text}
                                    el={freeTrailExpired}
                                    cost={freeTrailExpired?.subscriptions}
                                    title={
                                        freeTrailExpired &&
                                        freeTrailExpired[
                                            `title_${i18n.language}`
                                        ]
                                    }
                                    text={
                                        freeTrailExpired[
                                            `description_${i18n.language}`
                                        ]
                                    }
                                    additionalClasses="w-[303px] md:w-[502px]"
                                />
                            </div>
                        ) : (
                            el?.map((item, i) => (
                                <div key={i}>
                                    <Subscription
                                        checkSubscription={checkSubscription}
                                        setBuyFreeTrail={setBuyFreeTrail}
                                        text_btn={text}
                                        el={item}
                                        cost={item.subscriptions}
                                        title={item[`title_${i18n.language}`]}
                                        text={
                                            item[`description_${i18n.language}`]
                                        }
                                        additionalClasses="w-[303px] md:w-[502px]"
                                    />
                                </div>
                            ))
                        ))}
                    {type === 'season' && (
                        <>
                            {el?.seasons &&
                                el?.seasons[season - 1]?.episodes?.map(
                                    (elm, ind) => (
                                        <SelectedMovie
                                            seasonsProperty={seasonsProperty}
                                            el={el}
                                            checkSubscription={
                                                checkSubscription
                                            }
                                            subscription={subscription}
                                            setTvotModal={setTvotModal}
                                            tvotModal={tvotModal}
                                            purchase={purchase}
                                            episodeNumber={elm.episode_number}
                                            episodeId={elm.id ? elm.id : 0}
                                            seasonNumber={season}
                                            slug={el?.slug}
                                            key={ind}
                                            text={elm.title}
                                            imgSrc={elm?.file_info?.image}
                                        />
                                    ),
                                )}
                        </>
                    )}
                    {type === 'tv' && (
                        <>
                            {dataMovie?.map((item, i) => (
                                <div key={i}>
                                    <TvChannel
                                        el={item}
                                        title={item[`title_${i18n.language}`]}
                                        info={item?.description_ru}
                                        imgSrc={item.image}
                                        addClass="w-[140px] h-[140px] mobile:w-[200px] mobile:h-[150px]"
                                        linkTo={`/tv/channel?id=${item?.id}`}
                                    />
                                </div>
                            ))}
                        </>
                    )}
                    {type === 'recommendation' &&
                        dataMovie?.map((elm) => (
                            <Movie
                                el={elm}
                                key={elm.id}
                                text="kino"
                                MovieImg={MovieImg}
                                imgWidth={imgWidth}
                                layoutWidth="w-[108px] sm:w-[157px]"
                            />
                        ))}

                    {type === 'megogo' &&
                        dataMovie?.map((elm) => (
                            <Movie
                                el={elm}
                                key={elm.id}
                                text="kino"
                                MovieImg={MovieImg}
                                imgWidth={imgWidth}
                                layoutWidth="w-[108px] sm:w-[157px]"
                            />
                        ))}

                    {type === 'feedbacks' &&
                        dataMovie?.map((elm) => (
                            <div key={elm.id}>
                                <CommentsComponent item={elm} />
                            </div>
                        ))}

                    {type === 'premier' &&
                        dataMovie?.map((elm) => (
                            <Movie
                                el={elm}
                                key={elm.id}
                                text="kino"
                                MovieImg={MovieImg}
                                imgWidth={imgWidth}
                                layoutWidth="w-[108px] sm:w-[157px]"
                            />
                        ))}
                </div>

                {currentScroll > 0 && windowWidth[0] > 1200 && (
                    <div className="scroll-arrow px-4 bg-gradient-to-r from-black to-transparent group-hover:opacity-100 z-50">
                        <button
                            type="button"
                            className="transform rotate-180 h-full cursor-pointer mt-6"
                            onClick={() => scroll(false)}
                        >
                            <CarouselRightArrow />
                        </button>
                    </div>
                )}
                {maxScroll > currentScroll &&
                windowWidth[0] > 1200 &&
                (el?.seasons[season - 1]?.episodes?.length >= 5 ||
                    el?.length >
                        (type === 'feedbacks'
                            ? 4
                            : windowWidth[0] > 1900
                            ? 11
                            : 7) ||
                    dataMovie?.length >
                        (type === 'feedbacks'
                            ? 4
                            : windowWidth[0] > 1900
                            ? 11
                            : 7)) ? (
                    <div className="scroll-arrow right-0 px-4 justify-end bg-gradient-to-l from-black to-transparent group-hover:opacity-100 z-50">
                        <button
                            type="button"
                            className="cursor-pointer mt-6 h-full"
                            onClick={() => scroll(true)}
                        >
                            <CarouselRightArrow />
                        </button>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    )
}

export default ScrollComponent
