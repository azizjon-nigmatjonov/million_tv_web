import { CancelIcon } from 'components/svg'

export function MovieFilterSelectButton({
    element,
    handleClickElement = () => {},
}) {
    return (
        <div
            onClick={(e) => {
                e.preventDefault()
                handleClickElement(element)
            }}
            className="mt-[20px] inline-flex h-[50px] border-mainColor bg-mainColor text-white items-center rounded-[12px] cursor-pointer"
        >
            <div className="flex items-center gap-3 px-6 whitespace-nowrap text-lg">
                {element.title}
            </div>
        </div>
    )
}
