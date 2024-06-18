import { MillionTvIcon } from 'components/svg'
import { useTranslation } from 'i18n'
import cls from './style.module.scss'
import FooterApps from '../Apps'
import FooterSocials from '../Socials'
import CCollapse from 'components/CElements/CCollapse'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { setMoviesTabCurrent } from 'store/actions/application/moivesTabActions'
import { useDispatch } from 'react-redux'

export default function MobileFooter({ Links = [] }) {
    const { t } = useTranslation()
    const router = useRouter()
    const dispatch = useDispatch()

    const CollapseList = useMemo(() => {
        const array = []
        array.push({
            title: t('navigation'),
            children: Links?.map((i, index) => ({
                ...i,
                index: index - 1,
            })),
        })

        return array
    }, [Links, t])

    function handleClickChild(el) {
        router.push(`/catalog?slug=${el.slug}`)

        dispatch(setMoviesTabCurrent(el))
    }

    return (
        <div className={`wrapper ${cls.wrapper} bg-secondryBackground`}>
            <div className={cls.header}>
                <MillionTvIcon />
                <p className={cls.text}>{t('footer_subtitle')}</p>
            </div>
            <div className="mt-6">
                {CollapseList?.map((item, index) => (
                    <CCollapse
                        element={item}
                        key={index}
                        handleClickChild={handleClickChild}
                    />
                ))}
            </div>
            <div className="flex flex-col gap-6 mt-4">
                <FooterApps />

                <FooterSocials />
            </div>
        </div>
    )
}
