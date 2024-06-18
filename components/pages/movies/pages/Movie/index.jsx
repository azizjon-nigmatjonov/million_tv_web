import InfiniteScroll from 'react-infinite-scroll-component'
import CSkeleton from 'components/cards/CSkeleton'
import { useMobile } from 'hooks/useMobile'
import { useMemo } from 'react'
import CardMovie from 'components/cards/MovieCard'

export default function MovieCardWrapper({
    list = [],
    loading = true,
    handleMovieClick = () => {},
    handleScroll = () => {},
}) {
    const ipod = useMobile('ipod')
    const mobile = useMobile('mobile')

    const count = useMemo(() => {
        if (mobile) return 2
        if (ipod) return 4
        return 6
    }, [ipod, mobile])

    const ExtraSkeleton = () => (
        <div className="mt-5 wrapper">
            <CSkeleton count={count} />
        </div>
    )
    return (
        <>
            <InfiniteScroll
                dataLength={list?.length || 1}
                next={() => handleScroll()}
                hasMore={true}
                // loader={<ExtraSkeleton />}
                scrollableTarget="scrollableDiv"
            >
                <div
                    className="w-full movieGrid py-5 wrapper"
                    style={{ paddingTop: '20px' }}
                >
                    {list?.map((el, ind, row) => (
                        <div key={ind}>
                            <CardMovie
                                element={el}
                                handleMovieClick={handleMovieClick}
                                hoverToBottom={ind < 6}
                            />
                        </div>
                    ))}
                </div>
            </InfiniteScroll>
            {loading && <ExtraSkeleton />}
            {/* {!loading && !list.length && (
                <div className="flex mt-[90px] flex-col items-center">
                    <NullData
                        title={t('no_films')}
                        text={t('no_films_text')}
                        textButton={t('Reset_filters')}
                        icon={<NullFilter />}
                        link={() =>
                            router.replace(`/movies/${router?.query?.category}`)
                        }
                    />
                </div>
            )} */}
        </>
    )
}
