import React, { useEffect } from 'react'
import { ActiveIcon, DefaultIcon } from './filterSVG'
import router from 'next/router'
import cls from './selectStyle.module.scss'

export default function OptionButton({
    setGenreID,
    setGanreSelect,
    genreName,
    setGenreName,
    genre,
    placeholder,
}) {
    const optionName = genre.title ? genre.title : genre.name

    return (
        <button
            className={cls.options}
            key={genre.id}
            onClick={() => {
                setGanreSelect(false)
                setGenreID(genre.id)
                setGenreName(
                    optionName === genreName ? placeholder : optionName,
                )
            }}
        >
            <p>{optionName}</p>
            {router.query.genre ||
            router.query.countries ||
            router.query.releaseYear ? (
                genreName === optionName && <ActiveIcon />
            ) : (
                <DefaultIcon />
            )}
        </button>
    )
}
