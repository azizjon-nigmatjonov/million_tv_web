import React from 'react'
import Movie from '../../cards/Movie'
import { motion } from 'framer-motion'
import ActorPageTop from './Top'

const ActorPagewRapper = ({ data = {} }) => {
    return (
        <div className="wrapper">
            {data?.staff && <ActorPageTop actor={data?.staff} />}

            <div className="grid grid-cols-3 mobile:grid-cols-6 text-white gap-4">
                {data?.movies?.map((el, ind) => (
                    <motion.div
                        key={el.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            duration: 0.05,
                            delay: 0.05 * ind,
                            ease: [0.1, 0.01, -0.01, 0.1],
                        }}
                    >
                        <Movie
                            key={ind}
                            el={el?.movie}
                            layoutWidth="w-full"
                            hideContxt="paymentType"
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default ActorPagewRapper
