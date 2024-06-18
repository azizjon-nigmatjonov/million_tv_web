import cls from './styles.module.scss'
const MainButton = ({
    text = '',
    onClick,
    isLoading,
    type = 'button',
    disabled = false,
    additionalClasses = '',
    icon = '',
    margin,
}) => (
    <button
        type={type || 'button'}
        onClick={onClick}
        className={`${cls.btn} flex items-center text-white h-[44px] px-3 justify-center text-center rounded-[8px] outline-none border-none ${additionalClasses}`}
        disabled={disabled}
    >
        {isLoading ? (
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-500 h-[44px] w-6 mx-auto" />
        ) : (
            <>
                <div className="flex items-center space-x-[5px] whitespace-nowrap">
                    {icon && <span className={margin}>{icon}</span>}
                    {text && <span>{text}</span>}
                </div>
            </>
        )}
    </button>
)

export default MainButton
