import cls from './style.module.scss'
import Skeleton from '@mui/material/Skeleton'
import { useTranslation } from 'i18n'
import { useMemo } from 'react'
export default function NullDataFav({ subtext, loading, count = 3 }) {
    const { t } = useTranslation()
    const List = useMemo(() => {
        const res = []
        for (let i = 0; i < count; i++) {
            res.push(i)
        }
        return res
    }, [count])
    return (
        <div className={cls.nulldata}>
            {List?.map((i) => (
                // <div key={i} style={{ height: '200px' }}>
                <Skeleton
                    key={i}
                    sx={{
                        bgcolor: '#111B33',
                        width: '100%',
                        height: '200px',
                        borderRadius: '12px',
                    }}
                    variant="wave"
                />
                // </div>
            ))}
            {!loading && (
                <div className={cls.text}>
                    <h2>{t('no_data_favourite')}</h2>
                    <p>{t(subtext ? subtext : 'no_data_text_favourite')}</p>
                </div>
            )}
        </div>
    )
}
