import React, { useEffect } from 'react'
import { useState } from 'react'
import { MainIcon } from './filterSVG'
import OptionButton from './OptionButton'
import cls from './selectStyle.module.scss'
import Router from 'next/router'
import router from 'next/router'

export default function CostumeSelect({
    adornment,
    setGenre,
    className,
    placeholder,
    option,
}) {
    const [ganreSelect, setGanreSelect] = useState(false)
    const [genreName, setGenreName] = useState(placeholder)
    const [genreID, setGenreID] = useState('')
    // function removeGenre() {
    //     router.back()
    // }

    useEffect(() => {
        setGenre(
            placeholder === genreName
                ? ''
                : placeholder === 'Жанры'
                ? genreID
                : genreName,
        )
        // placeholder === genreName ? removeGenre() : ''
    }, [genreName, genreID])

    Router.events.on('routeChangeStart', () => {
        setGanreSelect(false)
    })

    return (
        <div className={cls.costumeSelect}>
            <button
                className={`${cls.select}`}
                onClick={(e) => setGanreSelect(!ganreSelect)}
            >
                {adornment ? adornment : null}
                <p className={cls.selectBtn}>
                    {router.query.genre ||
                    router.query.countries ||
                    router.query.releaseYear
                        ? genreName
                        : placeholder}
                </p>
                <div className={ganreSelect ? `${cls.mainIcon}` : ''}>
                    <MainIcon />
                </div>
            </button>
            <div
                className={
                    ganreSelect
                        ? `${cls.selectMenu} ${cls.active}`
                        : `${cls.selectMenu}`
                }
            >
                {ganreSelect &&
                    option.map((genre, ind) => (
                        <OptionButton
                            setGenreID={setGenreID}
                            key={ind}
                            placeholder={placeholder}
                            ganreSelect={ganreSelect}
                            setGanreSelect={setGanreSelect}
                            genreName={genreName}
                            setGenreName={setGenreName}
                            genre={genre}
                        />
                    ))}
            </div>
            {ganreSelect && (
                <div
                    onClick={() => setGanreSelect(false)}
                    className={cls.remove_bg}
                />
            )}
        </div>
    )
}
