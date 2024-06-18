import { useRouter } from 'next/router'
import cls from './style.module.scss'
import { useTranslation } from 'i18n'
import { useMobile } from 'hooks/useMobile'
import CScrollText from 'components/CElements/CScrollText'
import { useEffect, useRef, useState } from 'react'
import { CancelIcon } from 'screen-capture/icons'
import searchService from 'services/searchService'
import { parseCookies } from 'nookies'
import { deleteAction } from 'store/reducers/listenReducer'
import { useDispatch, useSelector } from 'react-redux'

export default function CardMovie({
    element,
    hoverToBottom = false,
    handleClick = () => {},
}) {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const minDesktop = useMobile('minDesktop')
    const router = useRouter()
    const tagRef = useRef(null)
    const { i18n } = useTranslation()
    const [showCancel, setShowCancel] = useState(false)
    const { user_id } = parseCookies()
    const searchOpen = useSelector((state) => state.searchReducer.set_search)

    function handleCardClick(item) {
        handleClick(item)
        let url = `/movie/${item?.slug}`
        if (minDesktop) url = `/preview/${item?.slug}`
        router.push(url)
    }

    useEffect(() => {
        if (element?.tagRef) {
            element.tagRef.style.background = element.tags[0]?.color
        }
    }, [element])

    const handleDeleteRecentlyWatched = (e, item) => {
        e.stopPropagation()
        const params = {
            user_id: user_id,
            movie_slug: item.slug,
        }
        searchService.deleteSearchHistory(params).then(() => {
            dispatch(deleteAction())
        })
    }

    return (
        <div
            className={`${cls.card} ${hoverToBottom ? cls.hoverToBottom : ''}`}
            onClick={() => handleCardClick(element)}
            onMouseEnter={() => setShowCancel(element?.id)}
            onMouseLeave={() => setShowCancel(false)}
        >
            <div className={cls.inner}>
                {showCancel == element.id && searchOpen && (
                    <button
                        onMouseEnter={() => setShowCancel(element?.id)}
                        onClick={(e) => handleDeleteRecentlyWatched(e, element)}
                        className={`${cls.cancelIcon} color-white cursor-pointer absolute hover:rotate-90 right-2 top-2 bg-[#5c6364] w-[32px] h-[32px] rounded-full z-10 duration-300 flex items-center justify-center`}
                    >
                        <CancelIcon width="12" height="12" />
                    </button>
                )}
                <div className={cls.imageWrapper}>
                    {element?.logo_image && (
                        <img
                            src={element?.logo_image}
                            alt="image"
                            className={cls.image}
                        />
                    )}
                    {element?.tags?.[0]?.title && (
                        <div
                            ref={(e) => (element.tagRef = e)}
                            className={`${cls.tags}`}
                        >
                            {element?.tags?.[0]?.title}
                        </div>
                    )}
                </div>
                <div className={cls.bottom}>
                    <h3 className={cls.title}>
                        <CScrollText text={element?.title} />
                    </h3>
                    <p
                        className={`${cls.infoPrice} ${
                            element?.payment_type === 'free'
                                ? cls.free
                                : element.payment_type === 'svod'
                                ? cls.svod
                                : cls.tvod
                        }`}
                    >
                        {t(
                            element.payment_type === 'free'
                                ? 'free'
                                : element.payment_type === 'svod'
                                ? 'subscription'
                                : element?.pricing?.substracted_price / 100 +
                                  ' ' +
                                  `${t('currency')}`,
                        )}
                    </p>
                    <p className={`${cls.infoMovie} space-x-1`}>
                        {element?.release_year > 0 && (
                            <span>{element?.release_year}</span>
                        )}
                        <span>·</span>
                        {element?.country && <span>{element?.country}</span>}
                        <span>·</span>
                        {element?.genres && (
                            <span>{element.genres[0]?.title}</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}
