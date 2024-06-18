import React, { useEffect } from 'react'
import InputMask from 'react-input-mask'
import { useTranslation } from 'i18n'
import CLabel from 'components/CElements/CLabel'

export default function FInputMask({
    control,
    register,
    clasess,
    required = false,
    classesInput,
    name,
    extra,
    errors = {},
    defaultValue = '',
    inputmode = 'text',
    setValue = () => {},
    formik,
    ...props
}) {
    const { t } = useTranslation()

    function handleChange(e) {
        if (!name) return
        formik.setFieldValue(name, e)
    }

    return (
        <div className={`w-full FInputMask ${clasess}`}>
            {props?.label && <CLabel title={props?.label} />}
            <InputMask
                onChange={(e) => {
                    handleChange(e.target.value)
                }}
                inputmode={inputmode}
                mask={props.mask}
                error={errors[name]}
                placeholder={t(props.placeholder)}
                className={` w-full h-[50px] bg-mainColor px-4 outline-none rounded-[12px] text-lg border border-mainColor focus:border-mainTextColor ${
                    defaultValue
                        ? 'placeholder:text-whiteLighter'
                        : 'placeholder:text-white'
                } ${errors[name] ? 'border border-error' : ''} ${classesInput}`}
                maskChar={props.maskChar}
                style={{ borderColor: errors[name]?.message ? 'red' : '' }}
                {...props}
            ></InputMask>
            {errors[name]?.message && (
                <p className="text-sm text-red-500">
                    {t(errors[name]?.message)}
                </p>
            )}

            {extra}
        </div>
    )
}
