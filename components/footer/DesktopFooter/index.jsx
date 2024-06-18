import { Link } from 'i18n'
import { MillionTvIcon } from 'components/svg'
import cls from '../Footer.module.scss'
import NextLink from 'components/common/link'
import FooterApps from '../Apps'
import FooterSocials from '../Socials'
import { useTranslation } from 'i18n'

export default function DesktopFooter({ Links }) {
    const { t } = useTranslation()
    return (
        <div className="footer bg-secondryBackground wrapper mt-16 sm:mt-28">
            <div className="py-6">
                <div className="grid grid-cols-3">
                    <div
                        className={`${cls.footer_left_text} logo flex flex-col`}
                    >
                        <Link href="/">
                            <a>
                                <MillionTvIcon />
                            </a>
                        </Link>
                        <p className="text-whiteLighter mt-2 max-w-[300px]">
                            {t('footer_subtitle')}
                        </p>
                    </div>
                    <div className="w-full">
                        <h4 className="mb-4 text-white font-medium">
                            {t('aboutus')}
                        </h4>
                        <div className="flex gap-20">
                            <ul className="flex flex-col gap-2 capitalize">
                                {Links?.slice(0, 4)?.map((elem, index) => (
                                    <li key={index}>
                                        <NextLink href={elem.link}>
                                            <a className={cls.footer__link}>
                                                {t(elem.title.toLowerCase())}
                                            </a>
                                        </NextLink>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <ul className="flex flex-col gap-2">
                                    {Links?.slice(4)?.map((elem, index) => (
                                        <li key={index}>
                                            <NextLink href={elem.link}>
                                                <a className={cls.footer__link}>
                                                    {t(elem.title)}
                                                </a>
                                            </NextLink>
                                        </li>
                                    ))}
                                    <li>
                                        <NextLink href="/privacy-policy">
                                            <a className={cls.footer__link}>
                                                {t('privacy_policy')}
                                            </a>
                                        </NextLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 ">
                        <FooterApps />
                        <FooterSocials />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-between border-t border-border py-5">
                <span
                    className="text-white opacity-[0.6] pb-3 cursor-pointer"
                    onClick={() => window.open(' https://udevs.io/', '_blank')}
                >
                    © MillionTv {t('interactiveTv')} {t('privacyPolicy')}
                </span>
                <span
                    className="text-white opacity-[0.6] pb-3 cursor-pointer"
                    onClick={() => window.open(' https://udevs.io/', '_blank')}
                >
                    {t('created_by_udevs')}
                </span>
            </div>
        </div>
    )
}
