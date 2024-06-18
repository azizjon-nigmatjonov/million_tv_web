import { Router } from 'i18n'
import { destroyCookie, parseCookies } from 'nookies'
import React, { useState, useEffect } from 'react'
import dropStyle from './DropDawn.module.scss'
import { useTranslation } from 'i18n'
import { LogoutIcon, PlusIconWhite, CheckIcon } from 'components/svg'
import axios from 'utils/axios'
import InfoModal from 'components/modal/InfoModal'
import { Link } from 'i18n'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useDispatch, useSelector } from 'react-redux'
import {
    setRecommendationValue,
    setRecommendationActivator,
} from 'store/actions/application/recommendationActions'
import { setProfilesList } from 'store/actions/application/profilesAction'
import { setProfile } from 'store/actions/application/profileAction'
import { setGlobalModalData } from 'store/actions/application/websiteAction'
import { useMobile } from 'hooks/useMobile'
import { useRouter } from 'next/router'

function DropDawn() {
    const { t } = useTranslation()
    const { session_id } = parseCookies()
    const profile = useSelector((state) => state.mainProfile.profile_value)
    const ProfilesList = useSelector((state) => state.profile.profiles_list)
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const router = useRouter()
    const mobile = useMobile('mobile')

    const dispatch = useDispatch()

    const profiles = ProfilesList?.profiles
    useEffect(() => {
        if (profiles) {
            for (let i = 0; i < profiles?.length; i++) {
                if (profiles[i].is_main) {
                    let saver = profiles[0]
                    profiles[0] = profiles[i]
                    profiles[i] = saver
                    return
                }
            }
        }
    }, [profiles])

    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const openModal = Boolean(anchorEl)

    const handleClick = (event) => {
        if (mobile) {
            router.push('/settings')
        } else setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const logout = () => {
        axios
            .delete(`/session`, {
                data: {
                    session_id,
                },
            })
            .then((res) => {
                destroyCookie(null, 'megogo_token', {
                    path: '/',
                })
                destroyCookie(null, 'profile_id', {
                    path: '/',
                })
                destroyCookie(null, 'access_token', {
                    path: '/',
                })
                destroyCookie(null, 'session_id', {
                    path: '/',
                })
                destroyCookie(null, 'user_id', {
                    path: '/',
                })
                destroyCookie(null, 'next-i18next', {
                    path: '/',
                })
                dispatch(setProfile(null))
                dispatch(setProfilesList(null))
                dispatch(setRecommendationValue(null))
                dispatch(setRecommendationActivator(false))
                sessionStorage.removeItem('listSelected')
                sessionStorage.removeItem('userActivation')
                window.localStorage.removeItem('idImageUpload')
                Router.push('/')
            })
    }

    const getMovieData = (ID) => {
        axios
            .get(`/profiles/${ID}`)
            .then((res) => {
                dispatch(setRecommendationValue(res?.data))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleAddAction() {
        handleClose()
        dispatch(
            setGlobalModalData({
                type: 'add_profile',
            }),
        )
    }

    return (
        <div className={dropStyle.drop}>
            <button
                onClick={handleClick}
                type="button"
                className={`${dropStyle.drop__btn} border border-border text-white font-bold w-[48px] h-[48px] rounded-[12px] uppercase bg-mainColor`}
            >
                {CurrentUserData && !CurrentUserData?.is_main ? (
                    <div>
                        {CurrentUserData?.profile_image ? (
                            <img
                                className={dropStyle.drop__img}
                                src={
                                    CurrentUserData?.profile_type ===
                                        'children' &&
                                    CurrentUserData?.profile_image === ''
                                        ? '../vectors/childrenProfile.svg'
                                        : CurrentUserData?.profile_image
                                        ? CurrentUserData.profile_image
                                        : '../vectors/movie-image-vector-user.svg'
                                }
                                alt="avatar"
                            />
                        ) : (
                            (CurrentUserData?.name
                                ? CurrentUserData?.name
                                : profile.name
                            )
                                ?.trim()
                                .substr(0, 1)
                        )}
                    </div>
                ) : (
                    <div>
                        {CurrentUserData?.profile_image ? (
                            <img
                                className={dropStyle.drop__img}
                                src={
                                    profile?.avatar
                                        ? profile.avatar
                                        : CurrentUserData?.profile_image
                                        ? CurrentUserData?.profile_image
                                        : '../vectors/movie-image-vector.svg'
                                }
                                alt="avatar"
                            />
                        ) : (
                            (CurrentUserData?.name
                                ? CurrentUserData?.name
                                : profile?.name
                            )
                                ?.trim()
                                .substr(0, 1)
                        )}
                    </div>
                )}
            </button>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openModal}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 2.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: '11px',
                            right: 20,
                            width: 0,
                            height: 0,
                            bgcolor: 'transparent',
                            zIndex: -1,
                            border: '8px solid transparent',
                            borderTop: '0',
                            borderBottom: '11px solid red',
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {profiles?.length > 0 ? (
                    <div>
                        {profiles?.map((item) => (
                            <div key={item?.id}>
                                <MenuItem onClick={handleClose}>
                                    <a
                                        onClick={() => getMovieData(item?.id)}
                                        className="relative"
                                    >
                                        {CurrentUserData?.id === item?.id && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <CheckIcon
                                                    width="15px"
                                                    height="12px"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-[12px] menu-item max-w-[260px]">
                                            <div
                                                className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center overflow-hidden font-[600] text-xl relative ${
                                                    item?.profile_image
                                                        ? ''
                                                        : item.is_main
                                                        ? 'profileImage'
                                                        : 'profileImageUser'
                                                }`}
                                            >
                                                {item?.profile_image ? (
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={
                                                            item?.profile_image
                                                        }
                                                        alt="avatar"
                                                    />
                                                ) : (
                                                    <div className="uppercase">
                                                        {item?.name
                                                            ?.trim()
                                                            .substr(0, 1)}
                                                    </div>
                                                )}
                                                {/* {item?.profile_type ===
                                                    'children' ||
                                                item?.profile_image ? (
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={item?.profile_image}
                                                        alt="avatar"
                                                    />
                                                ) : (
                                                    <div className="uppercase">
                                                        {item?.name
                                                            ?.trim()
                                                            .substr(0, 1)}
                                                    </div>
                                                )}
                                                {item?.profile_type ===
                                                    'children' &&
                                                    !item?.profile_image && (
                                                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-[12px]">
                                                            {t('child')}
                                                        </div>
                                                    )} */}
                                            </div>
                                            <h3 className="max-w-[160px] overflow-hidden flex flex-col">
                                                {item?.name}

                                                {item.is_main ? (
                                                    <span className="text-[12px] font-normal text-whiteLighter">
                                                        {t('mainProfile')}
                                                    </span>
                                                ) : item.profile_type ===
                                                  'children' ? (
                                                    <span className="text-[12px] font-normal text-whiteLighter">
                                                        {t('child profile')}
                                                    </span>
                                                ) : null}
                                            </h3>
                                        </div>
                                    </a>
                                </MenuItem>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <MenuItem onClick={handleClose}>
                            <a onClick={() => getMovieData(profile?.id)}>
                                <div className="flex items-center space-x-[12px] menu-item">
                                    <div className="w-[40px] h-[40px] overflow-hidden rounded-[12px] flex items-center justify-center uppercase font-[600] text-xl">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={
                                                profile?.profile_type ===
                                                    'children' &&
                                                profile?.profile_image === ''
                                                    ? '../vectors/childrenProfile.svg'
                                                    : profile?.avatar
                                                    ? profile?.avatar
                                                    : '../vectors/movie-image-vector.svg'
                                            }
                                            alt="profile.avatar"
                                        />
                                    </div>
                                    <h3>{profile?.name}</h3>
                                </div>
                                <div className="w-[75%] h-[1px] bg-[#fff] bg-opacity-[0.12] ml-auto"></div>
                            </a>
                        </MenuItem>
                    </div>
                )}
                {ProfilesList?.profile_limit !== ProfilesList?.count && (
                    <MenuItem onClick={handleAddAction}>
                        <div
                            className={`flex items-center space-x-[12px] w-full px-[25px] py-2`}
                        >
                            <div className="w-[40px] h-[40px] bg-mainColor rounded-[12px] flex items-center justify-center">
                                <PlusIconWhite width="18px" height="18px" />
                            </div>
                            <h3>{t('add')}</h3>
                        </div>
                    </MenuItem>
                )}
                <div className="px-[24px] w-full h-[1px] bg-[#fff] bg-opacity-[0.12] my-[6px]"></div>
                <MenuItem onClick={handleClose}>
                    <Link href="/settings?from=favourite">
                        <a>
                            <h4 className="py-[6px]">{t('favourite')}</h4>
                        </a>
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/settings?from=profile">
                        <a className="flex items-center space-x-[12px]">
                            <h4 className="py-[6px]">{t('settings')}</h4>
                        </a>
                    </Link>
                </MenuItem>

                <div>
                    <MenuItem onClick={handleClose}>
                        <a onClick={() => setOpen(true)}>
                            <h4 className="py-[6px] text-[#8B97B0]">
                                {t('logout')}
                            </h4>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 11.666L15.9596 10.7065C16.3501 10.3159 16.3501 9.68277 15.9596 9.29224L15 8.33268"
                                    stroke="#8B97B0"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M15.8333 10L10.8333 10M3.33325 14.3886V6.05527M13.3333 14.3886C13.3333 15.3091 12.5871 16.0553 11.6666 16.0553H8.33325M13.3333 6.05527C13.3333 5.1348 12.5871 4.38861 11.6666 4.38861H8.33325M4.07542 16.5501L5.74209 17.6612C6.84968 18.3996 8.33325 17.6056 8.33325 16.2744V4.16947C8.33325 2.83831 6.84968 2.04432 5.74209 2.78272L4.07542 3.89383C3.61175 4.20294 3.33325 4.72333 3.33325 5.28058V15.1633C3.33325 15.7206 3.61175 16.2409 4.07542 16.5501Z"
                                    stroke="#8B97B0"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </a>
                    </MenuItem>
                </div>
            </Menu>
            {open && (
                <InfoModal
                    open={open}
                    icon={<LogoutIcon />}
                    mainButton={t('logout')}
                    bgColorMain="bg-[#111B33]"
                    bgColorCencel="bg-[#03A9F4]"
                    textColorMain="text-[#fff]"
                    setOpen={setOpen}
                    title={t('logout_title')}
                    text={t('logout_text')}
                    onClick={() => {
                        logout()
                    }}
                />
            )}
        </div>
    )
}

export default DropDawn
