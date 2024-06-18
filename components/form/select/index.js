import { EnglishFlagIcon, RussianIcon, UzFlagIcon } from 'components/svg'
import React from 'react'
import Select, { components } from 'react-select'
import { InputContainer, InputLabel, InvisibleInput } from '..'
import { ActiveIcon } from '../costumeSelect/filterSVG'
import { selectStyles } from './styles'
import ClearIcon from '@mui/icons-material/Clear'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'i18n'

const useStyles = makeStyles({
    root: {
        position: 'absolute',
        right: '0px',
    },
})

const Control = ({ children, withReset, ...props }) => {
    const { adornment } = props.selectProps
    const { t, i18n } = useTranslation()
    const style = {
        cursor: 'pointer !important',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 8,
        postion: 'relative',
    }

    return (
        <div className="flex items-center bg-[#161616] rounded-[12px]">
            <components.Control {...props}>
                {adornment && <span style={style}>{adornment}</span>}
                {children}
                {/* <span>{props.selectProps?.value?.price}{t('sum')}</span> */}
            </components.Control>
            {props.hasValue && props.selectProps.withReset && (
                <span
                    className="cursor-pointer"
                    onClick={(event) => {
                        props.clearValue(null)
                    }}
                >
                    {/* <ClearIcon fontSize="small" /> */}
                </span>
            )}
        </div>
    )
}

// const DropdownIndicator = ({ ...props }) => {
//     return (
//         <components.DropdownIndicator {...props}>
//             <ArrowRight />
//         </components.DropdownIndicator>
//     )
// }

export default function SelectMenu({
    onChange,
    label,
    placeholder,
    options,
    adornment,
    value,
    required,
    defaultValue,
    isClearable,
    icon,
    withReset = false,
    isSearchable = false,
    getOptionLabel = (option) => option.title,
    getOptionValue = (option) => option.id,
    ...rest
}) {
    const Option = ({ children, isSelected, ...props }) => {
        const classes = useStyles()
        const { t, i18n } = useTranslation()
        return (
            <div className="relative">
                <components.Option {...props}>
                    <div className="flex items-center w-full">
                        {icon && (
                            <span className="mr-3">
                                {props.data.slug === 'ru' ? (
                                    <RussianIcon />
                                ) : props.data.slug === 'en' ? (
                                    <EnglishFlagIcon />
                                ) : (
                                    <UzFlagIcon />
                                )}
                            </span>
                        )}
                        <span
                            style={{
                                color: isSelected ? '#03A9F4' : '#fff',
                                overflow: 'hidden',
                            }}
                        >
                            {children}
                        </span>
                        <span className={classes.root}>
                            {isSelected && <ActiveIcon />}
                        </span>
                    </div>
                </components.Option>
            </div>
        )
    }

    const styles = selectStyles({
        boxShadow: 'none !important',
        border: 'none !important',
        hasValue: value && withReset ? true : false,
    })

    return (
        <InputContainer>
            <InputLabel>{label}</InputLabel>
            <Select
                defaultValue={defaultValue}
                onChange={onChange}
                options={options || []}
                adornment={adornment}
                components={{ Control, Option }}
                placeholder={placeholder}
                styles={styles}
                isSearchable={isSearchable}
                isClearable={false}
                value={value}
                withReset={withReset}
                noOptionsMessage={() => 'Нет варианта'}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
                {...rest}
            />
            <InvisibleInput required={required} value={value} />
        </InputContainer>
    )
}
