import React from 'react'
import Link from 'next/link'
import { i18n } from 'i18n'

function NextLink({ children, href, ...rest }) {
    return (
        <Link
            href={`${
                i18n.language !== 'ru' ? `/${i18n.language}${href}` : `${href}`
            }`}
            {...rest}
        >
            {children}
        </Link>
    )
}

export default NextLink
