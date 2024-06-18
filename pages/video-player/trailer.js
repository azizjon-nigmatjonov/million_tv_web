import PlayerForVideo from 'components/PlayerForVideo/PlayerForVideo'
import React from 'react'
import nookies from 'nookies'
import SEO from 'components/SEO'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'

export default function TrailerPlayer({
    movies,
    isTrailer,
    indNumber,
    currentTime,
    seasonNumber,
    episodeNumber,
    trailer_megago,
}) {
    return (
        <>
            <SEO />
            {isTrailer === true && (
                <PlayerForVideo
                    currentTime={currentTime}
                    indNumber={indNumber || 0}
                    isTrailer={isTrailer}
                    data={trailer_megago?.is_megogo ? trailer_megago : movies}
                    seasonNumber={seasonNumber}
                    episodeNumber={episodeNumber}
                />
            )}
        </>
    )
}

export async function getServerSideProps(ctx) {
    const cookies = nookies.get(ctx)
    const { query } = ctx
    const isTrailer = true

    const urls = [
        {
            endpoint: `megogo/movie/info?id=${query?.id}`,
        },
        {
            endpoint: `movies/${query.key}?profile_id=${query.profile_id}`,
        },
    ]

    const [megago, movies] = await fetchMultipleUrls(urls, ctx)

    const indNumber = query?.ind
    const currentTime = query.currentTime ? query?.currentTime : 0
    const trailer_megago =
        megago?.trailer?.videos?.length > 0
            ? {
                  trailer: [
                      {
                          videos: megago.trailer.videos.map((item) => ({
                              quality: item.quality,
                              file_name: item.src,
                          })),
                      },
                  ],
                  is_megogo: true,
              }
            : []

    return {
        props: {
            movies: movies ?? [],
            isTrailer,
            indNumber,
            currentTime,
            seasonNumber: query.seasonNumber ? query?.seasonNumber : 0,
            episodeNumber: query.episodeNumber ? query?.episodeNumber : 0,
            trailer_megago: trailer_megago ?? [],
        },
    }
}
