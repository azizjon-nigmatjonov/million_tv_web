import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation, Link } from 'i18n'
import { EditIcon2, PlusIconWhite } from '../../../../svg'
import axios from '../../../../../utils/axios'
import Skeleton from '@mui/material/Skeleton'
import { setRecommendationValue } from 'store/actions/application/recommendationActions'
import router from 'next/router'
import { setGlobalModalData } from 'store/actions/application/websiteAction'
export default function ProfilesList({
    from,
    setDialogOpen,
    setActiveUserDialog,
}) {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const ProfilesList = useSelector((state) => state.profile.profiles_list)
    const ScalettonNumber = [1, 2, 3]
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
    }, [])

    const getMovieData = (ID) => {
        axios
            .get(`/profiles/${ID}`)
            .then((res) => {
                setActiveUserDialog(res?.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const SetMovieData = (ID) => {
        axios
            .get(`/profiles/${ID}`)
            .then((res) => {
                dispatch(setRecommendationValue(res?.data))
                setTimeout(() => {
                    router.push('/')
                }, 300)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleDialogOpen = () => {
        setDialogOpen(true)
    }
    return (
        <>
            {from === 'desktop' ? (
                <div className="text-white w-full">
                    {ProfilesList?.profiles?.length ? (
                        <ul className="flex flex-col w-full">
                            {ProfilesList &&
                                ProfilesList?.profiles?.map((item) => (
                                    <li key={item.id}>
                                        {item.is_main && (
                                            <div className="bg-secondryBackground w-full px-[12px] py-[10px] rounded-[12px] flex items-center duration-200 h-[64px] max-w-[823px]">
                                                <div
                                                    className={`w-[48px] h-[48px] flex items-center justify-center rounded-[12px] text-[22px] font-[600] overflow-hidden uppercase ${
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
                                                                ?.substr(0, 1)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col ml-3 text-[14px] sm:text-[17px]">
                                                    <span>{item.name}</span>
                                                    {item.is_main ? (
                                                        <span className="text-[13px] leading-[18px] text-whiteLighter">
                                                            {t('mainProfile')}
                                                        </span>
                                                    ) : item.profile_type ===
                                                      'children' ? (
                                                        <span className="text-[13px] leading-[18px] text-whiteLighter">
                                                            {t('child profile')}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        handleDialogOpen()
                                                        getMovieData(item.id)
                                                    }}
                                                    className={` flex align-center  flex-row gap-[10px] ml-auto rounded-[12px] py-[6px] px-[12px] cursor-pointer hover:scale-110 duration-200 text-[14px] sm:text-[17px] bg-mainColor`}
                                                >
                                                    <EditIcon2 />
                                                    {t('edit')}
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            {ProfilesList &&
                                ProfilesList?.profiles?.map((item) => (
                                    <li key={item.id}>
                                        {!item.is_main && (
                                            <div className="mt-[12px] bg-secondryBackground w-full px-[12px] py-[10px] rounded-[12px] flex items-center duration-200 h-[64px] max-w-[823px]">
                                                <div
                                                    className={`w-[48px] h-[48px] flex border border-mainTextColor items-center justify-center rounded-[12px] text-[22px] relative font-[600] overflow-hidden ${
                                                        item?.profile_image
                                                            ? ''
                                                            : item.is_main
                                                            ? 'profileImage'
                                                            : 'profileImageUser'
                                                    }`}
                                                >
                                                    {item?.profile_image ? (
                                                        <img
                                                            className="w-[48px] h-[48px] object-cover"
                                                            src={
                                                                item?.profile_image
                                                            }
                                                            alt="avatar"
                                                        />
                                                    ) : (
                                                        <div className="uppercase">
                                                            {item?.name
                                                                ?.trim()
                                                                ?.substr(0, 1)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col ml-3 text-[14px] sm:text-[17px]">
                                                    <span>{item.name}</span>
                                                    {item.is_main ? (
                                                        <span className="text-sm text-whiteLighter">
                                                            {t('mainProfile')}
                                                        </span>
                                                    ) : item.profile_type ===
                                                      'children' ? (
                                                        <span className="text-sm text-whiteLighter">
                                                            {t('child profile')}
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        handleDialogOpen()
                                                        getMovieData(item.id)
                                                    }}
                                                    className={`flex align-center  flex-row gap-[10px] ml-auto rounded-[12px] py-[6px] px-[12px] cursor-pointer hover:scale-110 duration-200 text-[14px] sm:text-[17px] bg-mainColor`}
                                                >
                                                    <EditIcon2 />
                                                    {t('edit')}
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            {ProfilesList?.profile_limit !==
                                ProfilesList?.count && (
                                <div
                                    onClick={() => {
                                        dispatch(
                                            setGlobalModalData({
                                                type: 'add_profile',
                                            }),
                                        )
                                    }}
                                    className="bg-secondryBackground mt-[16px] rounded-[12px] flex items-center px-[12px] py-[10px] hover:scale-[1.01] duration-200 h-[64px] max-w-[823px]"
                                >
                                    <div className="w-[48px] h-[48px] flex items-center justify-center bg-mainColor rounded-[12px]">
                                        <PlusIconWhite
                                            width="26px"
                                            height="26px"
                                        />
                                    </div>
                                    <p className="text-[17px] ml-3">
                                        {t('new')}
                                    </p>
                                </div>
                            )}
                        </ul>
                    ) : (
                        <ul className="flex flex-col space-y-[12px]">
                            {ScalettonNumber.map((item) => (
                                <li key={item} className="h-[65px] w-full">
                                    <Skeleton
                                        sx={{
                                            bgcolor: '#111B33',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '8px',
                                        }}
                                        variant="wave"
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="scroll text-white flex overflow-x-scroll space-x-[14px]">
                    {profiles &&
                        profiles?.map((item) => (
                            <div key={item.id}>
                                <div
                                    className="w-[64px]"
                                    onClick={() => SetMovieData(item?.id)}
                                >
                                    <div
                                        className={`w-full h-[64px] flex items-center justify-center rounded-[12px] overflow-hidden text-[30px] relative ${
                                            item?.profile_image
                                                ? ''
                                                : item.is_main
                                                ? 'profileImage'
                                                : 'profileImageUser'
                                        }`}
                                    >
                                        {item?.profile_type === 'children' &&
                                            !item?.profile_image && (
                                                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-[12px]">
                                                    {t('child')}
                                                </div>
                                            )}
                                        {item?.profile_type === 'children' ||
                                        item?.profile_image ? (
                                            <img
                                                className="w-full h-full object-cover"
                                                src={
                                                    item?.profile_type ===
                                                        'children' &&
                                                    item?.profile_image === ''
                                                        ? '../vectors/childrenProfile.svg'
                                                        : item?.profile_image
                                                }
                                                alt="avatar"
                                            />
                                        ) : (
                                            item?.name?.trim()?.substr(0, 1)
                                        )}
                                    </div>
                                    <p className="text-[15px] break-words mt-[8px] text-center">
                                        {item.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    {ProfilesList?.profile_limit !== ProfilesList?.count && (
                        <Link href="/registration?from=profileCreate">
                            <div>
                                <div className="bg-mainColor flex items-center justify-center rounded-[12px] h-[64px]">
                                    <div className="w-[64px] h-[64px] flex items-center justify-center">
                                        <PlusIconWhite
                                            width="26px"
                                            height="26px"
                                        />
                                    </div>
                                </div>
                                <p className="text-[11px] break-words mt-[8px] text-center">
                                    {t('new')}
                                </p>
                            </div>
                        </Link>
                    )}
                </div>
            )}
        </>
    )
}
