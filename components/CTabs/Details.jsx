import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
// import { useIsMobile } from 'hooks/useMobile'
import { useTranslation } from 'i18n'
function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export default function CTab({
    tabList,
    value = 0,
    setValue = () => {},
    handleCustomClick = () => {},
    styles = {},
}) {
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    // const ipod = useIsMobile('ipod')
    const { t } = useTranslation()

    const customization = {
        '& .MuiTabs-flexContainer': {
            gap: '16px',
            display: 'inline-flex',
            borderBottom: '2px solid #111B33',
        },
        '& .MuiButtonBase-root': {
            background: 'transparent',
            borderRadius: '0',
            color: 'white',
            textTransform: 'none',
            fontSize: '16px',
            fontWight: '500',
            padding: '0 16px',
            textAlign: 'left',
            height: '48px',
        },
        '& .MuiButtonBase-root, & .MuiTab-root': {
            maxWidth: 'auto',
        },
        '& .Mui-selected': {
            transition: '0.7s',
            color: '#03A9F4 !important',
        },
        '& .MuiTabs-indicator': {
            borderRadius: '0',
            backgroundColor: '#03A9F4 !important',
            borderBottom: '2px solid #03A9F4',
            height: '2px',
        },
    }

    return (
        <Box sx={{ width: '100%' }} id="CTabID">
            <Box sx={{ ...customization, ...styles }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    // TabIndicatorProps={{
                    //   style: { display: "none" },
                    // }}
                    variant="scrollable"
                    scrollButtons={'auto'}
                    // allowScrollButtonsMobile
                    aria-label="scrollable force tabs example"
                >
                    {tabList?.map((tab, ind) => (
                        <Tab
                            disableRipple
                            key={ind}
                            onClick={() => handleCustomClick(tab)}
                            sx={{
                                '& .MuiButtonBase-root, & .MuiTab-root': {
                                    maxWidth: 'auto',
                                },
                            }}
                            label={
                                <p className="z-[2] relative  oswald-family">
                                    {t(tab?.name)}
                                </p>
                            }
                            {...a11yProps(tab.id)}
                        />
                    ))}
                </Tabs>
            </Box>
        </Box>
    )
}
