import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useTranslation } from 'i18n'
import { PremierIcon, MegagoIcon } from 'components/svg'
import { useMemo } from 'react'
import { useRouter } from 'next/router'

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}
export default function CTab({
    moviesTab = 0,
    handleChange = () => {},
    textTab,
}) {
    const { t } = useTranslation()

    const tabsList = useMemo(() => {
        const result = [
            {
                title: textTab,
            },
            {
                icon: <MegagoIcon />,
            },
            {
                icon: <PremierIcon />,
            },
        ]
        return result
    }, [textTab])

    const customization = {
        '& .tabs': {
            gap: '50px',
            display: 'flex',
        },
        '& .MuiButtonBase-root': {
            background: 'transparent',
            color: 'white',
            textTransform: 'none',
            fontSize: '24px',
            fontWight: '500',
            padding: '0',
            marginRight: '60px',
            textAlign: 'left',
            height: '48px',
        },
        '& .MuiButtonBase-root, & .MuiTab-root': {
            maxWidth: 'auto',
        },
        '& .Mui-selected': {
            color: '#fff !important',
        },
        '& .MuiTabs-indicator': {
            borderRadius: '4px',
            backgroundColor: '#fff',
            height: '2px',
        },
    }
    return (
        <>
            <Box sx={customization}>
                <Tabs
                    value={moviesTab}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable force tabs example"
                >
                    {tabsList?.map((item, ind) => (
                        <Tab
                            key={ind}
                            label={item?.icon ? item.icon : t(item.title)}
                            {...a11yProps(0)}
                            disableRipple
                        />
                    ))}
                </Tabs>
            </Box>
        </>
    )
}
