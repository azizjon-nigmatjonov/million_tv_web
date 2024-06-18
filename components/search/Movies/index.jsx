import CardMovie from 'components/cards/MovieCard'
import { useMemo } from 'react'
import ErrorSearch from '../ErrorSearch'
export default function SearchList({
    list = [],
    handleMovieClick = () => {},
    serarchValue,
    user_id,
    loading = true,
}) {
    const newList = useMemo(() => {
        return list
    }, [list])

    return (
        <div className="wrapper text-white">
            {user_id && (
                <h1 className="text-[22px] font-bold mb-3">
                    {serarchValue ? 'Резултаты поиска' : 'Недавно посмотронные'}
                </h1>
            )}

            <div className="movieGrid">
                {newList?.map((item, index) => (
                    <div key={index}>
                        <CardMovie
                            element={item}
                            handleClick={handleMovieClick}
                        />
                    </div>
                ))}
            </div>
            {!loading && !newList?.length ? <ErrorSearch /> : ''}
        </div>
    )
}
