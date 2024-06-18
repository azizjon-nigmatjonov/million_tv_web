import { useEffect, useState } from 'react'
import RcSwitch from 'rc-switch'

export default function CRSwitch({
    style,
    checked = false,
    disabled,
    ...props
}) {
    const [value, setValue] = useState(false)

    useEffect(() => {
        setValue(checked)
    }, [checked])
    return (
        <div id="rcswitch">
            <RcSwitch
                style={{ outline: 'none', ...style }}
                checked={value}
                onChange={(e) => {
                    if (!disabled) setValue(e)
                }}
                {...props}
            />
        </div>
    )
}
