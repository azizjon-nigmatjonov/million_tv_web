import { useEffect, useMemo, useState } from 'react'
import DesktopBannerSlider from './Slider'

export default function DesktopBanner({ list = [], favouriteList = [] }) {
    return (
        <div className="banner_gradiend min-h-[600px]">
            {list?.length && (
                <DesktopBannerSlider
                    list={list}
                    favouriteList={favouriteList}
                />
            )}
        </div>
    )
}
