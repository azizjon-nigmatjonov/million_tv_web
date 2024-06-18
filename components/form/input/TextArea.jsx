import { useEffect, useRef } from 'react'
import { useTranslation } from 'i18n'

function TextArea({
    value,
    label,
    type = 'text',
    error,
    id,
    handleChange,
    name,
    additionalClasses = '',
    touched,
    ...rest
}) {
    const { t } = useTranslation()
    return (
        <>
            <div className="f-col text-medium w-full">
                <textarea
                    value={value}
                    placeholder={t('write_here')}
                    onChange={handleChange}
                    className={`w-full h-full bg-blackDark text-[20px] placeholder-grey-800  font-normal px-3 py-2 border-gray-800 rounded-[8px] text-white resize-none 
                    ${
                        error && touched
                            ? 'border border-mainTextColor focus:placeholder-gray-800'
                            : ''
                    } ${additionalClasses}`}
                    // modify this part
                    name={name}
                    type={type}
                    required
                    {...rest}
                    rows="4"
                />
                <div className="text-mainTextColor -mt-1">
                    {error && touched ? error : ''}
                </div>
            </div>
        </>
    )
}

export default TextArea
