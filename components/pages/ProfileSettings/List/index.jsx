import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProfileSettingsCard from './Card'
import cls from './style.module.scss'
import axios from 'utils/axios'
export default function ProfileSettingsListWrapper({
    setActiveGenres = () => {},
}) {
    const { i18n } = useTranslation()
    const [genres, setGenres] = useState([])

    useEffect(() => {
        axios.get(`/filter-details?lang=${i18n?.language}`).then((response) => {
            setGenres(response?.data?.genres)
        })
    }, [i18n])

    function handleCheck(id) {
        const element = genres?.find((i) => i.id == id)
        element.checked = !element?.checked
        const array = []
        genres?.forEach((el) => {
            if (el?.checked) {
                array.push(element.id)
            } else {
                array.filter((i) => i != el.id)
            }
        })
        setActiveGenres(array)
    }

    return (
        <div className={cls.list}>
            {genres?.map((item, ind) => (
                <ProfileSettingsCard
                    element={item}
                    key={ind}
                    handleCheck={handleCheck}
                />
            ))}
        </div>
    )
}
