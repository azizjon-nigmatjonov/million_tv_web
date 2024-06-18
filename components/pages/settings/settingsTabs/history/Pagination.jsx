import { useState, useEffect } from 'react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import cls from './Pagination.module.scss'

function Pagination({
    count = 0,
    pageBound = 5,
    pageCount = 10,
    currentPage = 1,
    onChange = function () {},
    ...rest
}) {
    const [isActivePage, setIsActivePage] = useState(currentPage)
    const [upperPageBound, setUpperPageBound] = useState(pageBound)
    const [lowerPageBound, setLowerPageBound] = useState(0)

    useEffect(() => {
        onChange(isActivePage)
    }, [isActivePage])

    const pages = Math.ceil(count / pageCount)
    const gaps = Math.ceil(pages / (pageBound * 2))

    const btnIncrementClick = () => {
        setUpperPageBound(upperPageBound + pageBound)
        setLowerPageBound(lowerPageBound + pageBound)
        let listId = upperPageBound + 1
        setIsActivePage(listId)
    }

    const btnDecrementClick = () => {
        setUpperPageBound(upperPageBound - pageBound)
        setLowerPageBound(lowerPageBound - pageBound)
        let listId = upperPageBound - pageBound
        setIsActivePage(listId)
    }

    const listedItems = []
    for (let i = 1; i <= pages; i++) {
        listedItems.push(i)
    }
    let pageIncrementBtn = null
    let pageDecrementBtn = null

    if (lowerPageBound >= 1) {
        pageDecrementBtn = (
            <span
                //  className={cls.span}
                onClick={btnDecrementClick}
            >
                &hellip;
            </span>
        )
    }

    if (upperPageBound <= pages) {
        pageIncrementBtn = (
            <span className={cls.dots} onClick={btnIncrementClick}>
                &hellip;
            </span>
        )
    }

    const handleClick = (event) => {
        let listId = Number(event.target.id)
        setIsActivePage(listId)
    }

    const handleLastItemClick = () => {
        setUpperPageBound(pages + 1)
        setLowerPageBound(pages - pageBound)

        setIsActivePage(pages)
    }

    const handleFirstItemClick = () => {
        setUpperPageBound(pageBound)
        setLowerPageBound(0)

        setIsActivePage(listedItems[0])
    }

    const renderPageNumbers = listedItems.map((number) => {
        if (number === 1 && isActivePage === 1) {
            return (
                <span
                    key={number}
                    className={cls.active}
                    id={number}
                    onClick={handleClick}
                >
                    {number}
                </span>
            )
        } else if (number < upperPageBound + 1 && number > lowerPageBound) {
            return (
                <span
                    className={`${isActivePage === number && cls.active}`}
                    key={number}
                    id={number}
                    onClick={handleClick}
                >
                    {number}
                </span>
            )
        }
    })

    const goToPrevPage = () => {
        if (isActivePage !== 1) {
            if ((isActivePage - 1) % pageBound === 0) {
                setUpperPageBound((prev) => prev - pageBound)
                setLowerPageBound((prev) => prev - pageBound)
            }
            let listId = isActivePage - 1
            setIsActivePage(listId)
        }
    }

    const goToNextPage = () => {
        if (isActivePage !== pages) {
            if (isActivePage + 1 > upperPageBound) {
                setUpperPageBound((prev) => prev + pageBound)
                setLowerPageBound((prev) => prev + pageBound)
            }
            let listId = isActivePage + 1
            setIsActivePage(listId)
        }
    }

    return (
        <div className={cls.container}>
            <div {...rest} className={cls.row}>
                <div className={cls.littlecont}>
                    <span
                        className={isActivePage === 1 && cls.span}
                        onClick={goToPrevPage}
                    >
                        <ArrowBackIosIcon style={{ fontSize: '13px' }} />
                    </span>
                    <div className={cls.littlerow}>
                        {pageDecrementBtn && (
                            <span
                                key={listedItems[0]}
                                id={listedItems[0]}
                                onClick={handleFirstItemClick}
                            >
                                {listedItems[0]}
                            </span>
                        )}
                        {pageDecrementBtn}
                        {renderPageNumbers}
                        {pageIncrementBtn && (
                            <span className={cls.dots}>{pageIncrementBtn}</span>
                        )}
                        {pageIncrementBtn && (
                            <span
                                key={pages}
                                id={pages}
                                onClick={handleLastItemClick}
                            >
                                {pages}
                            </span>
                        )}
                    </div>

                    <span onClick={goToNextPage}>
                        <ArrowForwardIosIcon style={{ fontSize: '13px' }} />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Pagination
