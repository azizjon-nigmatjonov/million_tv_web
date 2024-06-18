import React, { useEffect, useState } from 'react'
import SEO from 'components/SEO'
import LoginForm from 'components/registration/LoginForm'
import AddUserForm from 'components/registration/AddUser'
import ChooseUser from 'components/registration/ChooseUser'
import { CancelIcon, LogoIcon, MillionTvIcon } from 'components/svg'
import { Link } from 'i18n'
import ResetPassword from 'components/registration/ResetPassword'
import OTPForm from 'components/registration/OTPForm'
import router from 'next/router'

export default function Registration() {
    const [step, setStep] = useState('login')
    const [phone, setPhone] = useState('')
    const [exists, setExists] = useState(false)
    const [loginData, setLoginData] = useState({})
    const routerFrom = router.router.query.from
    const [ProfileID, setProfileID] = useState(null)
    const [otpData, setOtpData] = useState(null)
    const [childrenName, setChildrenName] = useState(null)

    return (
        <>
            <SEO />
            <div className="registration_container">
                <div className="min-h-screen flex items-center justify-center relative">
                    <div className="absolute w-screen flex justify-between px-[30px] pt-6 top-0 text-10 text-white">
                        <Link
                            href={
                                router.query.movie
                                    ? `movie/${router.query.movie}`
                                    : '/'
                            }
                        >
                            <a>
                                <span className="cursor-pointer">
                                    <h1 className="sr-only">MillionTv</h1>
                                    <MillionTvIcon />
                                </span>
                            </a>
                        </Link>

                        <Link href="/">
                            <a className="flex items-center">
                                <span className="cursor-pointer w-4 h-4">
                                    <CancelIcon />
                                </span>
                            </a>
                        </Link>
                    </div>
                    {step === 'login' &&
                        routerFrom !== 'profileCreate' &&
                        routerFrom !== 'codeTv' && (
                            <LoginForm
                                setLoginData={setLoginData}
                                setExists={setExists}
                                setPhone={setPhone}
                                setStep={setStep}
                                phone={phone}
                            />
                        )}
                    {step === 'otp' && routerFrom !== 'codeTv' && (
                        <OTPForm
                            setOtpData={setOtpData}
                            loginData={loginData}
                            exists={exists}
                            phone_nmbr={phone}
                            setStep={setStep}
                            ProfileID={ProfileID}
                        />
                    )}
                    {step === 'addUser' && routerFrom !== 'profileCreate' && (
                        <AddUserForm
                            otpData={otpData}
                            setStep={setStep}
                            phoneNumber={phone}
                            setProfileID={setProfileID}
                            ProfileID={ProfileID}
                        />
                    )}
                    {step === 'chooseUser' && <ChooseUser setStep={setStep} />}
                    {step === 'reset-password' && (
                        <ResetPassword setStep={setStep} />
                    )}
                    {/* {routerFrom === 'profileCreate' && step !== 'children' && (
                        <AddUserForm
                            setStep={setStep}
                            phoneNumber={phone}
                            setChildrenName={setChildrenName}
                        />
                    )} */}
                    {routerFrom === 'codeTv' && (
                        <OTPForm
                            setOtpData={setOtpData}
                            loginData={loginData}
                            exists={exists}
                            phone_nmbr={phone}
                            setStep={setStep}
                            ProfileID={ProfileID}
                            from="codeTv"
                        />
                    )}
                </div>
            </div>
        </>
    )
}
