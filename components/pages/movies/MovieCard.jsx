import Image from 'next/image'

const Movie = ({ MovieImg }) => (
    <div className="w-[162px] text-left md:w-[182px] h-auto transition duration-500 ease-in-out transform md:hover:scale-103 hover:shadow">
        <div className="w-[162px] h-auto md:w-[182px] relative">
            <Image
                src={MovieImg}
                width={182}
                height={238}
                className="rounded-lg"
            />
            <div className="absolute w-auto top-4 flex flex-col space-y-1 text-white text-6 md:text-7 leading-7 md:leading-8">
                <div className="px-2 py-1 rounded-r-md bg-[#B90043] left-0 w-[86px]">
                    Премьера
                </div>
                <div className="px-2 py-1 rounded-r-md bg-[#0067F4] left-0 w-16">
                    Full HD
                </div>
                <div className="px-2 py-1 rounded-r-md bg-mainColor text-black left-0 w-auto">
                    На узбекском
                </div>
            </div>
        </div>
        <div className="flex flex-col lg:mt-2">
            <span className="text-white text-7 leading-8   md:text-8 md:leading-10 line-clamp-2 font-medium">
                Мстители : эра альтрона lorem ipsum fsadjfkdlfjasjfkladsfjl
            </span>
            <span className="text-red-500 font-400 text-7 leading-8  truncate mt-[6px]">
                Подписка
            </span>
        </div>
    </div>
)

export default Movie
