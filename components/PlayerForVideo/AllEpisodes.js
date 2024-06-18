import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'i18n'
import { NextEpisodeIcon, CarouselRightArrow, ArrowLeft } from 'components/svg'
import { useTranslation } from 'i18n'

export default function AllEpisodes({
    data,
    slug,
    seasonNumber,
    allData,
    seasonData,
    refHover,
    episodeOpen,
    setEpisodeOpen,
    setNextEpisode,
    setQualityOpen,
    episodeNumber,
    integrationSeasons,
}) {
    const [expanded, setExpanded] = useState(data?.id)
    const [seasonComponent, setSeasonComponent] = useState(false)
    const [newSeasonNumber, setNewSeasonNumber] = useState(null)
    const allEpisodes = seasonData[seasonNumber - 1]?.episodes
    let newSeason = seasonData[newSeasonNumber - 1]?.episodes
    const { t } = useTranslation()
    const refClear = useRef(null)
    const openButton = useRef(null)
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false)
    }

    const handleClickOutside = (e) => {
        if (
            !refClear?.current?.contains(e.target) &&
            !openButton?.current?.contains(e.target)
        ) {
            setEpisodeOpen(false)
        } else {
            if (
                openButton?.current?.contains(e.target) &&
                !refClear?.current?.contains(e.target)
            ) {
                setEpisodeOpen(!episodeOpen)
            }
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    })

    return (
        <>
            <div
                onClick={(e) => {
                    setEpisodeOpen(false)
                }}
                className={
                    episodeOpen
                        ? 'block absolute z-[99999999999999999999999999999999999999999] top-[-85vh] left-0 w-[330px] h-[100vh]'
                        : 'hidden'
                }
            />
            <div
                ref={refHover}
                onMouseLeave={() => {
                    setExpanded(data?.id)
                    setSeasonComponent(false)
                    // setNewSeasonNumber(null)
                }}
                className="containerAllEpisodesAndSeasons"
            >
                <div
                    ref={refClear}
                    className={
                        episodeOpen
                            ? `cont cont_active ${
                                  seasonComponent && seasonData.length === 1
                                      ? '!overflow-y-hidden'
                                      : ''
                              }`
                            : `cont`
                    }
                >
                    <div
                        className={
                            seasonComponent
                                ? 'all_seasons absolute fade-in-left'
                                : 'all_seasons absolute right-[-100%] z-[-8888888]'
                        }
                    >
                        <div className="all_seasons_header">
                            <span>
                                {integrationSeasons
                                    ? integrationSeasons?.title
                                    : allData?.title}
                            </span>
                        </div>
                        <ul className="seasons_list w-full">
                            {seasonData?.map((item, index, row) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setNewSeasonNumber(item.season_number)
                                        setSeasonComponent(false)
                                    }}
                                    className={`relative cursor-pointer seasons_item py-[18px] px-4 text-[15px] leading-5 font-semibold ${
                                        index + 1 === row.length
                                            ? ''
                                            : 'border-b border-opacity-[0.1] border-[#fff]'
                                    }`}
                                >
                                    <p>
                                        {t('season')}{' '}
                                        <span className="pl-1">
                                            {index + 1}
                                        </span>
                                    </p>
                                    <span className="absolute right-6">
                                        <CarouselRightArrow />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div
                        className={seasonComponent ? 'absolute w-[330px]' : ''}
                    >
                        <div className="header">
                            {/* <CloseIcon /> */}
                            <div
                                className="left cursor-pointer"
                                onClick={() => setEpisodeOpen(false)}
                            >
                                <ArrowLeft width="20" stroke="#8B97B0" />
                                <p className="lowercase">
                                    {newSeasonNumber
                                        ? newSeasonNumber
                                        : seasonNumber}{' '}
                                    {t('season')}
                                    {', '}
                                </p>
                                <p>
                                    <>{episodeNumber} </> {t('episode')}
                                </p>
                            </div>

                            {/* <button
                                className="season_btn hover:scale-105 duration-300"
                                onClick={() => setSeasonComponent(true)}
                            >
                                {t('allSeasons')}
                            </button> */}
                        </div>
                        <div className="list">
                            {(newSeason ? newSeason : allEpisodes)?.map(
                                (item, index) => (
                                    <div key={index}>
                                        <Link
                                            href={`/video-player?key=${slug}&ind=0&seasonNumber=${
                                                newSeason
                                                    ? newSeasonNumber
                                                    : seasonNumber
                                            }&episodeNumber=${index + 1}`}
                                        >
                                            <a>
                                                <div
                                                    className={`item flex items-center cursor-pointer`}
                                                >
                                                    <div>
                                                        <img
                                                            className="object-cover"
                                                            src={
                                                                item?.file_info
                                                                    ?.image
                                                                    ?.length > 0
                                                                    ? item
                                                                          ?.file_info
                                                                          ?.image
                                                                    : '../vectors/movie-image-vector.svg'
                                                            }
                                                            alt="image"
                                                        />
                                                    </div>
                                                    <div className="textpart ">
                                                        <h2
                                                            className={`title ${
                                                                item.episode_number ==
                                                                episodeNumber
                                                                    ? 'text-mainTextColor'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {index + 1}{' '}
                                                            {t('series')}
                                                        </h2>
                                                        {/* <p className="text">
                                                            {item.file_info.duration} мин.
                                                        </p> */}
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
                <div
                    ref={openButton}
                    onClick={() => {
                        setNextEpisode(false)
                        setQualityOpen(false)
                    }}
                    className={`buttonNextEpisode ${
                        !allEpisodes ? 'hidden' : 'block'
                    }`}
                >
                    <NextEpisodeIcon />
                    <p>Серии</p>
                </div>
            </div>
        </>
    )
}
