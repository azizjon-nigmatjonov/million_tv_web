import React from 'react'
import InputMask from 'react-input-mask'
import MaterialInput from '@material-ui/core/Input'

// Will work fine
export default function Input(props) {
    return (
        <InputMask mask="99/99/9999">
            <MaterialInput type="tel" disableUnderline />
        </InputMask>
    )
}
