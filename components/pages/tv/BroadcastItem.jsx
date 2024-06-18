import { TvPlayIcon } from 'components/svg'

const BroadcastItem = ({
    startTime = '10 : 00',
    duration = '50 мин',
    title = 'Новости',
    info = ' Познавательный”, Развлечения',
    ageLimit = '12+',
}) => (
    <div className="w-full h-[88px] flex items-center justify-between py-4 px-8  text-white bg-blackDark rounded-[8px] border border-transparent hover:border-mainColor">
        <div className="flex justify-between md:justify-start md:space-x-[42px] md:items-start">
            <div className="flex flex-col w-20">
                <span className="text-9 leading-12 md:text-8 md:leading-10 line-clamp-2 font-medium">
                    {startTime}
                </span>
                <span className="text-lightGray">{duration}</span>
            </div>
            <div className="h-full my-auto cursor-pointer hidden md:block">
                <TvPlayIcon />
            </div>
            <div className="flex flex-col justify-between items-start">
                <span className="text-8 leading-12 font-bold">{title}</span>
                <span className="text-lightGray">{info}</span>
            </div>
        </div>
        <div className="hidden h-10 w-10 bg-black rounded-[4px] md:flex items-center justify-center">
            {ageLimit}
        </div>
    </div>
)

export default BroadcastItem
