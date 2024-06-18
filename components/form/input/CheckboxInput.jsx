import { FormControlLabel, Checkbox } from '@material-ui/core'
import * as React from 'react'

const CheckboxInput = ({ text }) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
    return (
        <div className="text-white leading-12 flex flex-col">
            <FormControlLabel
                label={text}
                control={
                    <Checkbox
                        {...label}
                        iconStyle={{ fill: 'white' }}
                        inputStyle={{ color: 'white' }}
                        style={{ color: 'white' }}
                    />
                }
                defaultChecked
            />
        </div>
    )
}

export default CheckboxInput
