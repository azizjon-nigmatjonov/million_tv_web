import {
    AppGalleryTextIcon,
    AppGalleryLogoIcon,
    AppStoreTextIcon,
    AppStoreLogoIcon,
    TVFooterTextIcon,
    TVFooterLogoIcon,
    GoogleTextIcon,
    GoogleLogoIcon,
} from 'components/svg'
import { useMobile } from 'hooks/useMobile'
import { useTranslation } from 'i18n'
export default function FooterApps() {
    const { t } = useTranslation()
    const mobile = useMobile('mobile')
    return (
        <>
            <div className="grid grid-cols-2 gap-4 md:gap-5 mt-[24px] md:mt-0">
                <div className="flex items-center text-white bg-mainColor h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                    <GoogleLogoIcon />
                    <span className="ml-3">
                        <span className="text-[10px] uppercase tracking-wider">
                            {t('Get it on')}
                        </span>
                        <GoogleTextIcon width={mobile ? '100' : '120'} />
                    </span>
                </div>

                <div className="flex items-center text-white bg-mainColor h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                    <AppStoreLogoIcon />
                    <span className="ml-3">
                        <span className="text-[10px] uppercase tracking-wider">
                            {t('downloadOnthe')}
                        </span>
                        <AppStoreTextIcon width={mobile ? '100' : '120'} />
                    </span>
                </div>
                {/* <div className="flex items-center text-white bg-mainColor h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                    <AppGalleryLogoIcon />
                    <span className="ml-3">
                        <span className="text-[10px] uppercase tracking-wider">
                            {t('downloadOnthe')}
                        </span>
                        <AppGalleryTextIcon width={mobile ? '100' : '120'} />
                    </span>
                </div>
                <div className="flex items-center text-white bg-mainColor h-[60px] overflow-hidden px-[16px] rounded-[5px]">
                    <TVFooterLogoIcon />
                    <span className="ml-3">
                        <span className="text-[10px] uppercase tracking-wider">
                            {t('watch it on')}
                        </span>
                        <TVFooterTextIcon width={mobile ? '100' : '120'} />
                    </span>
                </div> */}
            </div>
        </>
    )
}
