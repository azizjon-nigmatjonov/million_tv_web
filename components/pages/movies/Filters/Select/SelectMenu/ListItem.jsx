import cls from './style.module.scss'
import { CheckIcon } from 'components/svg'

export function MovieFilterListItem({
    element,
    handleClickElement = () => {},
}) {
    return (
        <li
            key={element?.id}
            className={`${cls.item} ${element?.checked ? cls.checked : ''}`}
            onClick={(e) => {
                e.preventDefault()
                handleClickElement(element)
            }}
            style={{
                borderBottom:
                    element.value == 'kirgiziya' ? '1px solid #8B97B0' : '',
            }}
        >
            {element?.title}
            {element?.checked && (
                <div className={cls.checkbox}>
                    <CheckIcon fill="white" />
                </div>
            )}
        </li>
    )
}
