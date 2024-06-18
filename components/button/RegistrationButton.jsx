// import { ArrowForward } from 'components/svg'

const RegistrationButton = ({
    text,
    onClick,
    isLoading = false,
    type = 'button',
    disabled = false,
    icon = '',
    additionalClasses = '',
}) => (
    <button
        // eslint-disable-next-line react/button-has-type
        type={type}
        onClick={onClick}
        className={`w-full flex items-center rounded-[8px] text-white font-size-4 leading:4 font-bold p-4 justify-center text-center disabled:opacity-50 disabled:cursor-default
        ${additionalClasses}`}
        disabled={disabled}
    >
        {isLoading ? (
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-500 h-6 w-6 mx-auto" />
        ) : (
            <>
                <span>{icon}</span>
                <span className="ml-[10px]">{text}</span>
            </>
        )}
    </button>
)

export default RegistrationButton
