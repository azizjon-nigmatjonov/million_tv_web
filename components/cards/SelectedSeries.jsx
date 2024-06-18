import { Link } from 'i18n'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const SelectedSeries = ({ imgSrc, text, linkTo }) => (
    <Link href={linkTo}>
        <a className="block w-full">
            <div className="w-full text-left transition duration-500 ease-in-out transform md:hover:scale-105 hover:shadow">
                <div className="">
                    <LazyLoadImage
                        alt={text}
                        effect="blur"
                        delayTime={10000}
                        src={imgSrc}
                        className="w-full h-[164px] md:h-[200px] rounded-[8px] object-cover"
                    />
                </div>
                <span className="w-full mt-2 sm:mt-3 md:w-[250px] text-white text-[17px] md:text-[16px] font-medium lg:font-bold line-clamp-1">
                    {text}
                </span>
            </div>
        </a>
    </Link>
)

export default SelectedSeries
