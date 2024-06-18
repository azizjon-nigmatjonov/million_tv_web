import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
export default function MoviesWrapper({ movies = [] }) {
    const router = useRouter()
    const bannerText = useSelector((state) => state.bannerData.banner_text)
    const [page, setPage] = useState(1)

    const { data, isLoading, error, fetchNextPage, hasNextPage } =
        useInfiniteQuery(
            'GET_MEGOGO_LIST',
            () => {
                // fetch data here
            },
            {
                keepPreviousData: true,
            },
        )

    useEffect(() => {
        if (hasNextPage) {
            fetchNextPage()
        }
    }, [page])

    const ExtraSkeleton = () => (
        <div>
            aa
            {/* <CSkeleton
            classes="gap-[34px] mt-[30px] grid-cols-1 small:grid-cols-2 ipod:grid-cols-3"
            count={small ? 1 : ipod ? 2 : 3}
            height={400}
          /> */}
        </div>
    )

    return (
        <div className="min-h-[80vh] flex flex-col relative">
            <div className="md:w-1/2 text-white mt-5">
                <h1 className="text-[22px] sm:text-[34px] font-bold">
                    {bannerText}
                </h1>
            </div>
            aa
            {movies?.length ? (
                <InfiniteScroll
                    dataLength={movies?.length || 0}
                    style={{ overflow: 'visible' }}
                    next={() => {
                        handleScroll()
                    }}
                    hasMore={hasMore}
                    loader={<ExtraSkeleton />}
                >
                    a
                </InfiniteScroll>
            ) : (
                ''
            )}
        </div>
    )
}
