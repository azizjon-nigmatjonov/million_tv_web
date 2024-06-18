import { useTranslation, Router } from 'i18n'
import {
    CheckboxIconUnchecked,
    CheckboxIconChecked,
    PlusIconWhite,
} from '../svg'
import axios from '../../utils/axios'
import { useSelector } from 'react-redux'
import {
    setRecommendationValue,
    setRecommendationActivator,
} from 'store/actions/application/recommendationActions'
import { useDispatch } from 'react-redux'
import { setGlobalModalData } from 'store/actions/application/websiteAction'

const ProfilesList = ({ profiles, ProfilesList }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const RecommendationActive = useSelector(
        (state) => state.recommend.recommendation_active,
    )

    const handleCheckbox = () => {
        if (RecommendationActive) {
            dispatch(setRecommendationActivator(false))
        } else {
            dispatch(setRecommendationActivator(true))
        }
    }

    const getMovieData = (ID) => {
        axios
            .get(`/profiles/${ID}`)
            .then((res) => {
                dispatch(setRecommendationValue(res?.data))
                sessionStorage.setItem('listSelected', 'active')
                Router.push('/')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <div className="text-white wrapper flex items-center justify-center h-[100vh] flex-col">
                <h1 className="font-medium text-2xl sm:text-[48px]">
                    {t('whoIsHere?')}
                </h1>
                <div className="flex space-x-[8px] md:space-x-[24px] mt-[45px] mb-[40px] w-full justify-center">
                    {profiles &&
                        profiles?.map((item) => (
                            <div
                                className="w-[50px] md:w-[145px]"
                                key={item.id}
                            >
                                <div
                                    onClick={() => getMovieData(item?.id)}
                                    className="w-[50px] md:w-[145px]"
                                >
                                    <span className="cursor-pointer">
                                        {item?.profile_image ? (
                                            <div className="h-[50px] md:h-[145px] w-full object-cover rounded-full flex items-center justify-center overflow-hidden hover:scale-105 duration-300 relative">
                                                <img
                                                    className="w-full h-[50px] md:h-[145px] object-cover"
                                                    src={item?.profile_image}
                                                    alt="avatar"
                                                />
                                                {item?.profile_type ===
                                                    'children' &&
                                                    !item?.profile_image && (
                                                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 leading-25 font-bold text-[24px] sm:text-[36px]">
                                                            {t('child')}
                                                        </div>
                                                    )}
                                            </div>
                                        ) : (
                                            <div
                                                className={`h-[50px] md:h-[145px] border border-mainTextColor w-full object-cover rounded-full flex items-center justify-center uppercase font-[600] text-[24px] md:text-[72px] hover:scale-105 duration-300 ${
                                                    item?.profile_image
                                                        ? ''
                                                        : item.is_main
                                                        ? 'profileImage'
                                                        : 'profileImageUser'
                                                }`}
                                            >
                                                {item?.name
                                                    ?.trim()
                                                    ?.substr(0, 1)}
                                            </div>
                                        )}
                                    </span>
                                </div>
                                <p className="text-[10px] md:text-[17px] text-[#8B97B0] break-words text-center mt-[10px] hidden md:inline-block">
                                    {item.name}
                                </p>
                                {item?.profile_type === 'child' && (
                                    <p>{t('child profile')}</p>
                                )}
                            </div>
                        ))}

                    {ProfilesList?.profile_limit !== ProfilesList?.count && (
                        <div>
                            <div
                                onClick={() =>
                                    dispatch(
                                        setGlobalModalData({
                                            type: 'add_profile',
                                        }),
                                    )
                                }
                                className="h-[50px] md:h-[145px] w-[50px] md:w-[145px] object-cover bg-mainColor rounded-full flex items-center justify-center cursor-pointer hover:scale-105 duration-300"
                            >
                                <PlusIconWhite width="50px" height="50px" />
                            </div>
                            <p className="text-[12px] md:text-[17px] text-[#8B97B0] break-words text-center mt-[10px]">
                                {t('add')}
                            </p>
                        </div>
                    )}
                </div>
                <div
                    onClick={() => handleCheckbox()}
                    className="flex items-center space-x-[13px] cursor-pointer font-medium"
                >
                    {!RecommendationActive ? (
                        <CheckboxIconUnchecked />
                    ) : (
                        <CheckboxIconChecked />
                    )}
                    <p>{t('DontAskAgain')}</p>
                </div>
            </div>
        </>
    )
}

export default ProfilesList
