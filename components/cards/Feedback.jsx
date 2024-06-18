import Rating from '@mui/material/Rating'
import GradeRoundedIcon from '@mui/icons-material/GradeRounded'
import StarPurple500RoundedIcon from '@mui/icons-material/StarPurple500Rounded'
//smth
const Feedback = ({ imgSrc, text, name, date }) => {
    return (
        <div className="min-w-full sm:min-w-[395px] h-[auto] sm:h-[307px] p-6 bg-darkGray rounded-lg  text-white">
            <div className="min-w-[56px] flex items-start min-h-[40px]">
                <img
                    src={
                        imgSrc?.avatar
                            ? imgSrc?.avatar
                            : '../vectors/movie-image-vector.svg'
                    }
                    className="object-cover"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                    }}
                />
                <div className="h-full ml-2">
                    <h2 className="font-semibold text-[17px] leading-[16px]">
                        {name}
                    </h2>
                    <div className="mb-3 mt-1">
                        <Rating
                            icon={
                                <GradeRoundedIcon sx={{ color: '#03A9F4' }} />
                            }
                            emptyIcon={
                                <StarPurple500RoundedIcon
                                    sx={{ color: '#9D9D9D' }}
                                />
                            }
                            name="read-only"
                            value={imgSrc?.rate}
                            readOnly
                        />
                    </div>
                </div>
            </div>
            <div className="margin_null">
                <p className="text-[17px] leading-[22px] text-[#E9E9E9] m-0 line-clamp-9">
                    {text}
                </p>
            </div>
        </div>
    )
}

export default Feedback
