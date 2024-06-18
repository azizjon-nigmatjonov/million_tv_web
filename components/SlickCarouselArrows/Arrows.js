import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Box } from '@mui/material'
import Image from 'next/image'

export function ArrowRight(props) {
    const { className, style, onClick, styles } = props

    return (
        <div className={`${className} ${styles || ''}`}>
            <Box
                component={ArrowForwardIosIcon}
                sx={{
                    ...style,
                    background: 'none',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={onClick}
            >
                <Image src={ArrowForwardIosIcon} alt="" />
            </Box>
        </div>
    )
}
export function ArrowLeft(props) {
    const { className, style, onClick, styles } = props

    return (
        <div className={`${className} ${styles || ''}`}>
            <Box
                component={ArrowBackIosIcon}
                sx={{
                    ...style,
                    background: 'none',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={onClick}
            >
                <Image src={ArrowBackIosIcon} alt="" />
            </Box>
        </div>
    )
}
