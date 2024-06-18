export const selectStyles = (props) => ({
    container: (styles, { isFocused }) => ({
        ...styles,
        minWidth: '100%',
        width: '100%',
        backgroundColor: '#262626',
        // border: '1px solid #393939',
        borderRadius: '8px',
        outline: 'none',
    }),
    control: (styles, { isDisabled, isFocused, isSelected }) => ({
        ...styles,
        backgroundColor: isDisabled ? '#000' : '#111B33',
        width: props?.inline ? 'auto' : '100%',
        padding: '9px 15px',
        border: 'none',
        borderRadius: '12px',
        outline: 'none',
        boxShadow: 'none',
        cursor: 'pointer',
        '@media (max-width: 768px)': {
            padding: '5px',
        },
    }),
    menu: (styles) => ({
        ...styles,
        backgroundColor: '#111B33',
        padding: '12px 15px',
        borderRadius: '12px',
        top: '60px !important',
        width: '100%',
        height: '217px',
        overflow: 'auto',
        // display: 'flex',
        zIndex: '99999 !important',
        '@media (max-width: 768px)': {
            width: '100%',
        },
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
        ...styles,
        backgroundColor: isDisabled
            ? null
            : isSelected
            ? data.color
            : isFocused
            ? 'transparent'
            : null,
        position: 'relative',
        width: '100% !important',
        textOverflow: 'ellipsis',
        padding: '12px 0',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: '100% ',
        fontSize: '17px',
        lineHeight: '22px',
        zIndex: 99999999,
        color: isSelected ? '#03A9F4' : data.color,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        ':active': {
            color: isDisabled ? '#ccc' : isSelected ? '#03A9F4' : data.color,
            backgroundColor:
                !isDisabled && (isSelected ? '#333041' : '#333041'),
        },
        '@media screen and (max-width: 576px)': {
            lineHeight: '19px !important',
            fontSize: '16px !important',
        },
    }),
    input: (styles) => ({
        ...styles,
        fontSize: '20px',
        lineHeight: '24px',
        color: '#fff',
    }),
    placeholder: (styles) => ({
        ...styles,
        color: '#C6C6C6 !important',
        textOverflow: 'ellipsis',
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontSize: '20px !important',
        lineHeight: '25px !important',
        '@media screen and (max-width: 576px)': {
            lineHeight: '28px !important',
            fontSize: '17px !important',
        },
    }),
    singleValue: (styles) => ({
        ...styles,
        fontSize: '20px',
        lineHeight: '24px',
        color: '#fff',
        '@media screen and (max-width: 576px)': {
            lineHeight: '28px !important',
            fontSize: '17px !important',
        },
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),

    dropdownIndicator: (base, state) => ({
        ...base,
        transform: state.selectProps.menuIsOpen
            ? 'rotate(180deg)'
            : 'rotate(0)',
        transition: '250ms',
        '&': {
            svg: {
                fill: 'white',
                display: props.hasValue ? 'block' : 'block',
            },
        },
        height: '36px',
    }),
})
