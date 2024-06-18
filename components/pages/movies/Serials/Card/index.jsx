import { useTranslation } from 'i18n'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
// import EmptyIcon from '../../../../../public/icons/actor.svg'
export default function SerialCard({
    element,
    seasonNumber,
    episodeNumber,
    slug,
}) {
    const { t } = useTranslation()
    const router = useRouter()

    function GetDuration(duration) {
        let result = ''
        const helper = duration - (duration % 60)
        if (duration) {
            // const hours = duration / 3600 < 1 ? '' : duration` ${t('hour')}`
            // const minutes =
            //     (duration % 3600) / 60 < 1
            //         ? `${duration} секунды`
            //         : `${duration} ${t('minutes')}`
            // result = result + hours ? hours : ''
            // result = result + minutes ? minutes : ''

            result = `${helper / 60} ${t('hour')} ${
                duration - helper == 0
                    ? ''
                    : duration - helper + `${t(' minute')}`
            } `
        }

        return result
    }

    return (
        <div
            className="text-white"
            onClick={() => {
                router.push(
                    `/video-player?key=${slug}&trailer=${false}&ind=0&seasonNumber=${seasonNumber}&episodeNumber=${episodeNumber}${
                        element?.last_episode?.season_key == seasonNumber &&
                        element?.last_episode?.episode_key == episodeNumber &&
                        element?.last_episode?.seconds > 0
                            ? `&lastTime=${element?.last_episode?.seconds}`
                            : ''
                    }`,
                )
            }}
        >
            <div className="h-[150px] max-h-[150px]">
                <img
                    className="rounded-[8px] object-cover w-full h-full cursor-pointer hover:scale-[1.05] duration-300"
                    src={element.file_info.image}
                    alt={element.file_info.image || 'img'}
                />
            </div>
            <div className="min-h-[54px]">
                <h4 className="font-medium mt-2">
                    {element.episode_number} {t('series')}
                </h4>
                <p className="font-medium text-sm text-whiteLighter">
                    {GetDuration(element.file_info?.videos?.[0]?.duration)}
                </p>
            </div>
        </div>
    )
}
