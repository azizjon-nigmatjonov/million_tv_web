import Skeleton from '@mui/material/Skeleton'
export default function SkeletonHomePage() {
    return (
        <div>
            <div className="h-[200px] mobile:h-[500px] w-[90vw] mx-auto mt-[40px]">
                <Skeleton
                    sx={{
                        bgcolor: '#111B33',
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                    }}
                    variant="wave"
                />
            </div>
        </div>
    )
}
