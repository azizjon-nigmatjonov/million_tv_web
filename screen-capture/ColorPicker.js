import { Popover } from '@mui/material'
import { useState } from 'react'
import styles from './style.module.scss'

const colors = [
    '#40BC86',
    '#F31D2F',
    '#B17E22',
    '#FCB410',
    '#FF8600',
    '#2980B9',
    '#528CCB',
    '#4E6D76',
    '#8B96A0',
    '#181D21',
    '#FC575E',
    '#00D717',
]

export default function ColorPicker({
    anchorEl,
    handleClose,
    switchColor,
    id,
    open,
}) {
    return (
        <>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className={styles.colors}>
                    {colors.map((item) => (
                        <div
                            className={styles.item}
                            key={item}
                            onClick={() => switchColor(item)}
                            style={{ background: item }}
                        ></div>
                    ))}
                </div>
            </Popover>
        </>
    )
}
