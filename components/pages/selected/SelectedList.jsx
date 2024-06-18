import React from 'react'
import SelectedSeries from 'components/cards/SelectedSeries'
import { useTranslation } from 'i18n'
import cls from './selected.module.scss'

const SelectedList = ({ selections }) => {
    const { t } = useTranslation()
    return (
        <div className="px-4 md:px-[56px] flex flex-col pb-10 md:pb-[100px] mt-4">
            <div className="text-white md:mb-5">
                <h2 className="page-header">{t('selected')}</h2>
            </div>
            <div className={cls.selected_aligens + ` mt-3 sm:mt-[56px]`}>
                {selections?.map((selection) => (
                    <SelectedSeries
                        selection={selection.movie}
                        key={selection.id}
                        text={selection.title}
                        imgSrc={
                            selection?.image
                                ? selection?.image
                                : '../../../public/vectors/movie-image-vector.svg'
                        }
                        linkTo={`/selected/list?key=${selection.slug}&lang=${selection.lang}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default SelectedList
