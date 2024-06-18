import React from 'react'
import { Link } from 'i18n'
import { ProfileSquareIcon } from 'components/svg'

const LoginButton = ({ text }) => (
    <Link href="/registration">
        <a>
            <button
                type="button"
                className="bg-mainColor h-11 px-2 sm:px-4 py-2.5 rounded-[8px] flex items-center space-x-[10px] hover:bg-opacity-[0.85] duration-100"
            >
                <ProfileSquareIcon />
                <span className="font-medium text-8 leading-11 text-whiteLighter">
                    {text}
                </span>
            </button>
        </a>
    </Link>
)

export default LoginButton
