import PlayerForVideo from 'components/PlayerForVideo/PlayerForVideo'
import { parseCookies } from 'nookies'
import SEO from 'components/SEO'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'
import router from 'next/router'

export default function VideoPlayerPage({
    movies,
    isTrailer,
    indNumber,
    currentTime,
    seasonNumber,
    episodeNumber,
    track,
}) {
    return (
        <>
            <SEO />
            {isTrailer === false && (
                <PlayerForVideo
                    currentTime={currentTime}
                    indNumber={indNumber}
                    isTrailer={isTrailer}
                    data={movies}
                    track={
                        router?.query?.lastTime
                            ? router?.query?.lastTime
                            : track
                    }
                    seasonNumber={seasonNumber}
                    episodeNumber={episodeNumber}
                />
            )}
        </>
    )
}

export async function getServerSideProps(ctx) {
    const { query } = ctx
    const isTrailer = false
    const { user_id } = parseCookies(ctx)

    const urls = [
        {
            endpoint: `movies/${query.key}?profile_id=${query.profile_id}`,
        },
        {
            endpoint: `episode-track?movie_key=${query.key}&user_id=${user_id}${
                query.seasonNumber ? `&season_key=${query.seasonNumber}` : ''
            }${
                query.episodeNumber ? `&episode_key=${query.episodeNumber}` : ''
            }`,
        },
    ]

    const [movies, track] = await fetchMultipleUrls(urls, ctx)

    const indNumber = query?.ind
    const currentTime = query.currentTime ? query?.currentTime : 0

    return {
        props: {
            movies: movies ?? [],
            isTrailer,
            indNumber,
            currentTime,
            seasonNumber: query.seasonNumber ? query?.seasonNumber : 0,
            episodeNumber: query.episodeNumber ? query?.episodeNumber : 0,
            track,
        },
    }
}
