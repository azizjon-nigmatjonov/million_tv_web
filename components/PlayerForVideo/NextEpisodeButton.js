import router from 'next/router'
import React from 'react'
import { Link } from 'i18n'
import { NextEpisodeIcon } from 'components/svg'
import { useTranslation } from 'i18n'

export default function NextEpisodeButton({
    data,
    slug,
    seasonNumber,
    episodeNumber,
    refNextEpisode,
    qualityOpen,
    episodeOpen,
    setEpisodeOpen,
    setQualityOpen,
    setNextEpisode,
    nextEpisode,
}) {
    const { t } = useTranslation()
    return (
        <>
            <div
                onClick={(e) => {
                    setNextEpisode(false)
                }}
                className={
                    nextEpisode
                        ? 'block absolute z-[99999999999999999999999999999999999999999] top-[-85vh] left-0 w-full h-[100vh]'
                        : 'hidden'
                }
            />
            <div ref={refNextEpisode} className="containerNextEpisode">
                <Link
                    href={`/video-player?key=${slug}&ind=0&seasonNumber=${seasonNumber}&episodeNumber=${
                        parseInt(episodeNumber) + 1
                    }`}
                >
                    <a className="buttonNextEpisode">
                        <div
                            className={
                                nextEpisode ? 'cont cont_active scroll' : 'cont'
                            }
                        >
                            <div className="header">
                                {t('The next episode')}
                            </div>
                            <div className="body">
                                <img
                                    src={
                                        data?.file_info?.image?.length > 0
                                            ? data?.file_info?.image
                                            : '../vectors/movie-image-vector.svg'
                                    }
                                    alt="episode_img"
                                />
                                <div className="textpart">
                                    <h6>
                                        {data?.episode_number}. {data?.title}
                                    </h6>
                                    <p>{data?.description}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </Link>
                <button
                    onClick={() => {
                        setNextEpisode(!nextEpisode)
                        setQualityOpen(false)
                        setEpisodeOpen(false)
                    }}
                >
                    <NextEpisodeIcon />
                </button>
            </div>
        </>
    )
}
