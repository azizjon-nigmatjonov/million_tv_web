import { useMemo } from 'react'
import NullDataSubsciption from '../NullData'
import UnpurchasedCard from './Card'
import getMonthDay from 'utils/getMonthDay'

export default function ListPurchased({
    list = [],
    loading = truncate,
    nullData = {},
}) {
    return (
        <>
            <div className="grid mobile:grid-cols-2 gap-4 mt-[30px]">
                {list?.map((item) => (
                    <UnpurchasedCard element={item} key={item.id} />
                ))}
            </div>

            {!list.length && (
                <NullDataSubsciption loading={loading} nullData={nullData} />
            )}
        </>
    )
}
