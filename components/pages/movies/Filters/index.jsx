import cls from './style.module.scss'
import MoviesFilterSelect from './Select'
import { useMemo, useState } from 'react'
import MovieFilterSelectButtons from './Buttons'
import { useMobile } from 'hooks/useMobile'
import { useTranslation } from 'i18n'
import OptimizeQuery from 'utils/optimizeQuery'
import { useRouter } from 'next/router'
export default function MoviesFilter({
    moviesTab,
    filterdetails,
    megogoFilters,
    currentTab,
}) {
    const { t } = useTranslation()
    const ipod = useMobile('ipod')
    const [open, setOpen] = useState(null)
    const router = useRouter()
    const queries = { ...router.query }

    const Countries = useMemo(() => {
        const klip = {
            uzbekistan: 'uzbekistan',
            rossiya: 'rossiya',
            ssha: 'ssha',
            turciya: 'turciya',
            indiya: 'indiya',
            iran: 'iran',
            tadzhikistan: 'tadzhikistan',
            kazakhstan: 'kazakhstan',
            'respublika-koreya': 'respublika-koreya',
            kirgiziya: 'kirgiziya',
        }

        const serial = {
            uzbekistan: 'uzbekistan',
            rossiya: 'rossiya',
            ssha: 'ssha',
            turciya: 'turciya',
            indiya: 'indiya',
            iran: 'iran',
            'respublika-koreya': 'respublika-koreya',
            meksika: 'meksika',
            braziliya: 'braziliya',
            tadzhikistan: 'tadzhikistan',
            kazakhstan: 'kazakhstan',
            kirgiziya: 'kirgiziya',
        }

        let langs = ''

        if (currentTab?.slug === 'serial' || currentTab?.slug === 'tele-show')
            langs = serial
        else langs = klip

        const list = []
        filterdetails?.countries?.forEach((item) => {
            const element = {
                value: item?.slug,
                title: item?.name,
                checked: false,
            }
            if (element.value in langs) {
                langs[element.value] = element
            } else {
                list.push(element)
            }
        })

        return Object.values(langs).concat(list)
    }, [filterdetails, currentTab])

    const Genres = useMemo(() => {
        return (
            filterdetails?.genres?.map((item) => ({
                checked: false,
                value: item?.id,
                ...item,
            })) ?? []
        )
    }, [filterdetails])

    const Years = useMemo(() => {
        return megogoFilters?.filter_by
            ? megogoFilters?.filter_by[3]?.items?.map((item) => ({
                  ...item,
                  checked: false,
                  title: item.slug === '-1969' ? 'до 1969' : item.slug,
                  value: item.slug,
              }))
            : {}
    }, [megogoFilters])

    function handleClick(number) {
        if (number === open) setOpen(null)
        else setOpen(number)
    }

    function clearFilters() {
        Object.keys(queries).map((key) => {
            if (key?.includes('filter_')) {
                delete queries[key]
            }
        })
        router.push({
            path: router.pathname,
            query: { ...OptimizeQuery(queries) },
        })
    }

    return (
        <div className={cls.wrapper}>
            <div className={cls.filters}>
                {currentTab?.slug !== 'kliplar' && (
                    <MoviesFilterSelect
                        list={Genres}
                        title={'genres'}
                        isOpen={open === 1}
                        handleClick={(e) => {
                            e.preventDefault()
                            handleClick(1)
                        }}
                        multiple={true}
                        width={ipod ? '100%' : 120}
                        leftWidth={ipod ? '100%' : 240}
                        columns={1}
                    />
                )}
                {moviesTab !== 2 && (
                    <MoviesFilterSelect
                        list={Countries}
                        title={'Countries'}
                        isOpen={open === 2}
                        handleClick={(e) => {
                            e.preventDefault()
                            handleClick(2)
                        }}
                        multiple={true}
                        width={ipod ? '100%' : 130}
                        leftWidth={ipod ? '100%' : 240}
                        columns={1}
                    />
                )}
                {moviesTab !== 2 && (
                    <MoviesFilterSelect
                        list={Years}
                        title={'years'}
                        columns={1}
                        isOpen={open === 3}
                        handleClick={(e) => {
                            e.preventDefault()
                            handleClick(3)
                        }}
                        width={ipod ? '100%' : 110}
                        leftWidth={ipod ? '100%' : 200}
                    />
                )}
                <button
                    onClick={() => clearFilters()}
                    className="text-whiteLighter hidden mobile:inline-block"
                >
                    {t('clear')}
                </button>
            </div>
            <MovieFilterSelectButtons
                Genres={Genres}
                Countries={Countries}
                Years={Years}
                filterTitles={['genres', 'Countries', 'years']}
            />
            {open ? (
                <div
                    onClick={(e) => {
                        e.preventDefault()
                        handleClick(open)
                    }}
                    className="fixed w-full h-[100vh] z-[998] left-0 top-0"
                ></div>
            ) : (
                ''
            )}
        </div>
    )
}
