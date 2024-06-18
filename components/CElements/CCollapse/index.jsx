import ListItemButton from '@mui/material/ListItemButton'
import { ExpandLess, ExpandMore, Language } from '@mui/icons-material'
import Collapse from '@mui/material/Collapse'
import { useState } from 'react'
import { useTranslation } from '../../../i18n'
export default function CCollapse({ element = {}, classes, handleClickChild }) {
    const { t, i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    function handleClick() {
        setIsOpen((prev) => !prev)
    }
    console.log('element', element?.title_ru)
    return (
        <div className={`bg-[#020C24] mb-4 rounded-[12px] w-full ${classes}`}>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    handleClick(element)
                }}
                className={`py-5 px-4 flex  justify-between w-full ${
                    isOpen ? 'border-b border-border' : ''
                }`}
            >
                <p className={`font-bold text-white text-lg`}>
                    {element?.[`title_${i18n.language}`]}
                </p>
                {isOpen ? (
                    <ExpandLess style={{ color: '#A4AFC1' }} />
                ) : (
                    <ExpandMore style={{ color: '#A4AFC1' }} />
                )}
            </button>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <div className="px-4 mt-3">
                    {element?.children?.map((children, ind) => (
                        <div
                            onClick={() => handleClickChild(children)}
                            key={ind}
                            className="my-3 flex items-center justify-between"
                        >
                            <div className="text-[#D9D8E0] leading-[30px]">
                                {children?.[
                                    `title_${i18n.language}`
                                ]?.toLowerCase()}
                            </div>
                        </div>
                    ))}
                </div>
            </Collapse>
        </div>
    )
}
