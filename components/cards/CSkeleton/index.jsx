import Skeleton from '@mui/material/Skeleton'
export default function CSkeleton({
    isArray = true,
    variant = 'rectangular',
    classes,
    skeletonClasses,
    width = '100%',
    height = 300,
    count = 8,
}) {
    return (
        <>
            {isArray ? (
                <div className={`flex gap-[20px] w-full ${classes}`}>
                    {Array.from(Array(count)).map((item, ind) => (
                        <Skeleton
                            key={ind}
                            variant={variant}
                            width={width}
                            height={height}
                            className={`w-full bg-mainColor rounded-[10px] ${skeletonClasses} relative`}
                            sx={{
                                bgcolor: '#111B33',
                            }}
                        />
                    ))}
                </div>
            ) : (
                <Skeleton
                    variant={variant}
                    width={width}
                    height={height}
                    className={`w-full bg-mainColor rounded-[10px] ${skeletonClasses} relative`}
                    sx={{
                        bgcolor: '#111B33',
                    }}
                />
            )}
        </>
    )
}
