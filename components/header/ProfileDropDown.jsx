import React from 'react'
import { styled, alpha, Button, Menu, MenuItem } from '@material-ui/core'
import Image from 'next/image'
import { useTranslation } from 'i18n'
import { ProfileDropDownIcon } from 'components/svg'
import AvatarImg from '../../public/images/avatar.png'

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light'
                ? 'rgb(55, 65, 81)'
                : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
            backgroundColor: 'black',
            fontSize: '14px',
            fontWeight: '500',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
            '&:hover': {
                backgroundColor: '#292929',
            },
        },
    },
}))

export default function ProfileDropDown() {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const { t } = useTranslation()

    return (
        <div>
            <Button
                id="demo-customized-button"
                aria-controls="demo-customized-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                // variant="contained"
                disableElevation
                onClick={handleClick}
                className="flex items-center justify-between w-16 cursor-pointer"
                // endIcon={<KeyboardArrowDownIcon />}
            >
                <Image
                    src={AvatarImg}
                    width={36}
                    height={36}
                    className="rounded-full"
                    alt=""
                />
                <ProfileDropDownIcon />
            </Button>
            <StyledMenu
                className="mt-10"
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} disableRipple>
                    {/* <EditIcon /> */}
                    <Image
                        src={AvatarImg}
                        width={50}
                        height={50}
                        className="rounded-lg"
                        alt=""
                    />
                    <span className="ml-4">Jasur</span>
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    {/* <EditIcon /> */}
                    <Image
                        src={AvatarImg}
                        width={50}
                        height={50}
                        className="rounded-lg"
                        alt=""
                    />
                    <span className="ml-4">Jasur</span>
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    {/* <EditIcon /> */}
                    <Image
                        src={AvatarImg}
                        width={50}
                        height={50}
                        className="rounded-lg"
                        alt=""
                    />
                    <span className="ml-4">Jasur</span>
                </MenuItem>
                <div className="w-[80%] bg-[#5B6871] h-[1px] mx-auto mt-4 mb-2" />
                <MenuItem onClick={handleClose} disableRipple>
                    <span className="drop-link">{t('payment')}</span>
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    <span className="drop-link">{t('saved')}</span>
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    <span className="drop-link">{t('settings')}</span>
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    <span className="drop-link">{t('logout')}</span>
                </MenuItem>
            </StyledMenu>
        </div>
    )
}
