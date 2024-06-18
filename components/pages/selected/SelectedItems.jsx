import React from 'react'
import Movie from '../../cards/Movie'
import { useTranslation } from 'i18n'
import NoCards from 'components/errorPopup/NoCards'
import { NullDataSearchIcon } from 'components/svg'
import { motion } from 'framer-motion'

const SelectedItems = ({ selection }) => {
    const { t } = useTranslation()
    return (
        <div className="w-full px-4 md:px-[55px] flex flex-col md:mt-4">
            <div className="text-white hidden md:block">
                <h2 className="page-header">
                    {selection?.title} {t('watch_online')}
                </h2>
                <p className="text-midGray mt-2">{selection?.description}</p>
            </div>
            {selection?.movies?.length > 0 ? (
                <div className="movies-grid-comp movies-grid-colums">
                    {selection?.movies.map((movie, ind) => (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.05,
                                delay: 0.05 * ind,
                                ease: [0.1, 0.01, -0.01, 0.1],
                            }}
                            className="movie-card-mobile"
                        >
                            <Movie
                                key={movie.id}
                                el={movie}
                                text={movie.title}
                                MovieImg={movie.logo_image}
                                linkTo="/movies/movie"
                                layoutWidth="w-[100%] 2xl:w-[157px]"
                                imgWidth="h-[220px]"
                            />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="my-10 flex justify-center ">
                    <NoCards
                        icon={<NullDataSearchIcon />}
                        title={t('there_is_not_data')}
                        text={t('maybe_see_other_pages_where_data_exists')}
                    />
                </div>
            )}
        </div>
    )
}

export default SelectedItems
