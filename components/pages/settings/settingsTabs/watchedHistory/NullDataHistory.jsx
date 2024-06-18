import cls from './style.module.scss'
import Skeleton from '@mui/material/Skeleton'
import { useTranslation } from 'i18n'
export default function NullDataHistory() {
    const { i18n } = useTranslation()
    return (
        <div className={cls.nulldata}>
            {[1, 2, 3].map((i) => (
                <div key={i}>
                    <Skeleton
                        sx={{
                            bgcolor: '#111B33',
                            width: '100%',
                            height: '200px',
                            borderRadius: '12px',
                        }}
                        variant="wave"
                    />
                </div>
            ))}
            <div className={cls.text}>
                {i18n.language === 'ru' && (
                    <p>
                        Здесь будут храниться купленные вами фильмы и сериалы.
                        Их просмотр будет доступен на всех устройствах,
                        подключённых к вашей учётной записи.
                    </p>
                )}
                {i18n.language === 'en' && (
                    <p>
                        This is where your purchased movies and series will be
                        stored. Their viewing will be available on all devices
                        connected to your account.
                    </p>
                )}
                {i18n.language === 'uz' && (
                    <p>
                        Bu yerda siz sotib olgan film va seriallar saqlanadi.
                        Ularni ko'rish hisobingizga ulangan barcha qurilmalarda
                        mavjud bo'ladi.
                    </p>
                )}
            </div>
        </div>
    )
}
