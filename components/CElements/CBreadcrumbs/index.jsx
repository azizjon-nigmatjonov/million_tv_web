import { Breadcrumbs } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import FolderIcon from '@mui/icons-material/Folder'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
// import BackButton from '../../BackButton'

const CBreadcrumbs = ({
    icon,
    withDefautlIcon,
    size,
    className,
    items,
    type = 'element',
    progmatic = false,
}) => {
    const router = useRouter()

    const navigateHandler = (link, index) => {
        if (index === items?.length - 1) return null
        if (link == -1) {
            router.back()
            return
        }
        router.push(link)
    }

    return (
        <div className="CBreadcrumbs-wrapper">
            {/* {navigateLink && <BackButton link={navigateLink} />} */}
            <Breadcrumbs
                className={`CBreadcrumbs ${size} ${className}`}
                separator={<NavigateNextIcon fontSize="small" />}
            >
                {items?.map((item, index, row) => (
                    <div
                        key={index}
                        className={`breadcrumb-item ${
                            item?.link ? '' : 'last'
                        } ${type}`}
                    >
                        {icon}
                        {withDefautlIcon && <FolderIcon />}
                        {type === 'link' && item?.link ? (
                            <div
                                onClick={() =>
                                    navigateHandler(item.link, index)
                                }
                                className="breadcrumb-label"
                            >
                                {item.label}
                            </div>
                        ) : (
                            <div className="breadcrumb-label">{item.label}</div>
                        )}
                    </div>
                ))}
            </Breadcrumbs>
        </div>
    )
}

export default CBreadcrumbs
