import { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import { makeStyles } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import { setPlayerSpeed } from '../libs/setPlayerSpeed'
import useDidUpdate from '../libs/useDidUpdate'

function removeQuery(link, query, newQueryValue) {
    if (link.includes('?')) {
        let allQuery = link.split('?')[1].split('&')
        allQuery = allQuery.filter((el) => !el.includes(query[0]))
        allQuery = allQuery.filter((el) => !el.includes(query[1]))
        const preResult = allQuery.length ? allQuery.join('&') : ''
        const result = `${link.split('?')[0]}?${preResult}${
            allQuery.length ? '&' : ''
        }${query}=${newQueryValue}`
        return result
    }
    const result = `${link}?${query}=${newQueryValue}`
    return result
}
const useStyles = makeStyles(() => ({
    active: {
        background: '#ff5722',
    },
    pre_active: {
        background: 'rgba(255, 87, 34, 0.3)',
    },
    btn: {
        width: '100%',
        padding: '0',
        borderRadius: '0',
    },
    quality: {
        left: '-65px !important',
        bottom: '0 !important',
    },
    speed: {
        left: '-66px !important',
        bottom: '0 !important',
    },
    paper: {
        zIndex: '5',
        top: 'auto !important',
        transform: 'translate3d(0,0,0) !important',
        '& .MuiListItem-root': {
            fontFamily: '"Open Sans", sans-serif',
            color: '#fff',
            height: '32px',
            minHeight: '24px',
            fontSize: '13px',
            fontWeight: '600',
            minWidth: '60px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '& .MuiList-root': {
            padding: '0 !important',
        },
        '& .MuiListItem-root:hover': {
            background: '#ff5722',
        },
        '& .MuiListItem-root:last-child': {
            borderBottom: '0',
        },
        '& .MuiPaper-root': {
            borderRadius: '8px !important',
            overflow: 'hidden',
            backgroundColor: 'rgba(0, 0, 0, 0.5) !important',
            backdropFilter: 'blur(12px) !important',
        },
    },
}))
const imageAddr = '../images/BackgroundSplash.png'
const downloadSize = 584473 // bytes
const speedValues = [0.5, 0.75, 1, 1.25, 1.5, 2]
function MoviePlayerSettings({
    popUpSetting,
    mainMenu,
    qualityMenu,
    setMainMenu,
    subtitleMenu,
    setPopUpSetting,
    t,
    setlastTime,
    player,
    activeElement,
    setSource,
    lastTime,
    source,
    paused,
    isIOSDevice,
}) {
    const [speedValue, setSpeedValue] = useState(1)
    const [qualityValue, setQualityValue] = useState(source?.quality)
    const [qualityAuto, setQualityAuto] = useState(!isIOSDevice)
    const [open, setOpen] = useState(false)
    const anchorRef = useRef(null)
    const Router = useRouter()
    const [open2, setOpen2] = useState(false)
    const [speed, setSpeed] = useState()
    const handleToggle2 = () => {
        setOpen2((prevOpen) => !prevOpen)
    }
    const anchorRef2 = useRef(null)
    const classes = useStyles()

    function MeasureConnectionSpeed() {
        let startTime
        let endTime

        function showResults() {
            const duration = (endTime - startTime) / 1000
            const bitsLoaded = downloadSize * 8
            const speedBps = (bitsLoaded / duration).toFixed(2)
            setSpeed(speedBps)
        }
        const download = new Image()
        download.onload = () => {
            endTime = new Date().getTime()
            showResults()
        }
        download.onerror = (err, msg) => {
            // console.log(err, msg)
        }
        startTime = new Date().getTime()
        const cacheBuster = `?nnn=${startTime}`
        download.src = imageAddr + cacheBuster
    }
    const setQuality = (num) => {
        if (qualityMenu.current) {
            setPopUpSetting(false)
            qualityMenu.current.children.forEach((div) => {
                div.classList.remove('active')
            })
            qualityMenu.current.children[num].classList.add('active')
        }
    }
    const setSubtitle = (num) => {
        if (subtitleMenu.current) {
            setPopUpSetting(false)
            subtitleMenu.current.children.forEach((div) => {
                div.classList.remove('active')
            })
            subtitleMenu.current.children[num].classList.add('active')
        }
    }
    const measureSpeedName = (sp) => {
        const k4 = 36700160
        const p1080 = 8388608
        const p720 = 5242880
        const p480 = 2621440
        const p360 = 1048576
        if (sp < p360) {
            return '240p'
        }
        if (sp >= p360 && sp < p480) {
            return '360p'
        }
        if (sp >= p480 && sp < p720) {
            return '480p'
        }
        if (sp >= p720 && sp < p1080) {
            return '720p'
        }
        if (sp >= p1080 && sp < k4) {
            return '1080p'
        }
        if (sp >= k4) {
            return '4k'
        }
        return '240p'
    }
    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault()
            setOpen(false)
        }
    }

    const firstMount = useRef(true)
    useEffect(() => {
        setQuality(0)
        setSubtitle(1)
        setPlayerSpeed(1, player)
    }, [activeElement])
    useDidUpdate(() => {
        if (qualityAuto && !isIOSDevice) {
            setTimeout(MeasureConnectionSpeed, 60000)
        }
    }, [speed, qualityAuto])
    useEffect(() => {
        if (!isIOSDevice) {
            MeasureConnectionSpeed()
        }
    }, [])
    useDidUpdate(() => {
        if (!qualityAuto) {
            setQualityValue(source?.quality)
        }
        if (player.current) {
            player.current.seek(lastTime)
            if (!paused) {
                setTimeout(() => player.current.play(), 0)
            }
        }
    }, [source, qualityAuto])
    useDidUpdate(() => {
        if (speed && qualityAuto && !isIOSDevice && !firstMount.current) {
            const measured = measureSpeedName(speed)
            if (activeElement?.videos) {
                activeElement?.videos.forEach((video) => {
                    if (video?.quality === measured) {
                        if (player.current) {
                            setlastTime(
                                player.current.getState()?.player?.currentTime,
                            )
                            setTimeout(() => setSource(video), 0)
                        }
                    }
                })
            } else if (activeElement?.file_info?.videos) {
                activeElement?.file_info?.videos?.forEach((video) => {
                    if (video?.quality === measured) {
                        if (player.current) {
                            setlastTime(
                                player.current.getState()?.player?.currentTime,
                            )
                            setTimeout(() => setSource(video), 0)
                        }
                    }
                })
            }
        }
        firstMount.current = false
    }, [speed, isIOSDevice])
    useEffect(() => {
        if (!Router.query?.quality) {
            setQualityValue(null)
            if (isIOSDevice) {
                setQualityAuto(false)
            } else {
                setQualityAuto(true)
            }
        } else if (isIOSDevice) {
            setQualityAuto(false)
        } else {
            setQualityAuto(true)
        }
        setSpeedValue(1)
    }, [activeElement, isIOSDevice])
    // useEffect(() => {
    //   if (!qualityAuto ) {
    //     setQualityValue(source?.quality)
    //   }
    // }, [source])
    return (
        <div
            className={`popup-inline ${popUpSetting ? 'show' : 'hide'} ${
                isIOSDevice && 'ios'
            }`}
        >
            <div className={`main-menu ${mainMenu ? 'show' : 'hide'}`}>
                <ClickAwayListener onClickAway={() => setOpen(false)}>
                    <div
                        className="setting-menu"
                        onMouseEnter={() => setOpen(true)}
                        onMouseLeave={() => setOpen(false)}
                    >
                        <Button
                            ref={anchorRef}
                            aria-controls={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            className={classes.btn}
                            disableRipple
                        >
                            {t('movie.quality')}{' '}
                            <span className="value">
                                (
                                {qualityAuto
                                    ? `${t('movie.auto')} ${source?.quality}`
                                    : source?.quality}
                                )
                            </span>
                        </Button>
                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            className={`${classes.paper} ${classes?.quality}`}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'right'
                                                ? 'right top'
                                                : 'right bottom',
                                    }}
                                >
                                    <Paper>
                                        <MenuList
                                            autoFocusItem={open}
                                            id="menu-list-grow"
                                            onKeyDown={handleListKeyDown}
                                        >
                                            {!isIOSDevice && (
                                                <MenuItem
                                                    onClick={() => {
                                                        setQualityAuto(true)
                                                        setQualityValue(null)
                                                        setOpen(false)
                                                        setPopUpSetting(false)
                                                        setMainMenu(false)
                                                    }}
                                                    className={
                                                        qualityAuto
                                                            ? classes.active
                                                            : ''
                                                    }
                                                >
                                                    {t('movie.auto')}{' '}
                                                </MenuItem>
                                            )}
                                            {activeElement
                                                ? activeElement.videos
                                                    ? activeElement.videos?.map(
                                                          (el, index) => (
                                                              <MenuItem
                                                                  key={index}
                                                                  onClick={() => {
                                                                      if (
                                                                          isIOSDevice
                                                                      ) {
                                                                          const qualityQuery =
                                                                              removeQuery(
                                                                                  Router.asPath,
                                                                                  'quality',
                                                                                  el?.quality,
                                                                              )
                                                                          window.location.replace(
                                                                              `https://voxe.tv${qualityQuery}`,
                                                                          )
                                                                      } else {
                                                                          setQualityAuto(
                                                                              false,
                                                                          )
                                                                          setQualityValue(
                                                                              el?.quality,
                                                                          )
                                                                          setOpen(
                                                                              false,
                                                                          )
                                                                          setPopUpSetting(
                                                                              false,
                                                                          )
                                                                          setMainMenu(
                                                                              false,
                                                                          )
                                                                          setSource(
                                                                              el,
                                                                          )
                                                                          if (
                                                                              player.current
                                                                          ) {
                                                                              setlastTime(
                                                                                  player.current.getState()
                                                                                      ?.player
                                                                                      ?.currentTime,
                                                                              )
                                                                              setTimeout(
                                                                                  () => {
                                                                                      if (
                                                                                          !paused
                                                                                      ) {
                                                                                          player.current.play()
                                                                                      }
                                                                                  },
                                                                                  0,
                                                                              )
                                                                          }
                                                                      }
                                                                  }}
                                                                  className={`${
                                                                      qualityValue ===
                                                                      el?.quality
                                                                          ? classes.active
                                                                          : ''
                                                                  }`}
                                                              >
                                                                  {el?.quality}
                                                              </MenuItem>
                                                          ),
                                                      )
                                                    : activeElement.file_info &&
                                                      activeElement.file_info?.videos?.map(
                                                          (el, index) => (
                                                              <MenuItem
                                                                  key={index}
                                                                  onClick={() => {
                                                                      if (
                                                                          isIOSDevice
                                                                      ) {
                                                                          const qualityQuery =
                                                                              removeQuery(
                                                                                  Router.asPath,
                                                                                  'quality',
                                                                                  el?.quality,
                                                                              )
                                                                          window.location.replace(
                                                                              `https://voxe.tv${qualityQuery}`,
                                                                          )
                                                                      } else {
                                                                          setQualityValue(
                                                                              el?.quality,
                                                                          )
                                                                          setQualityAuto(
                                                                              false,
                                                                          )
                                                                          setOpen(
                                                                              false,
                                                                          )
                                                                          setPopUpSetting(
                                                                              false,
                                                                          )
                                                                          setMainMenu(
                                                                              false,
                                                                          )
                                                                          setSource(
                                                                              el,
                                                                          )
                                                                          if (
                                                                              player.current
                                                                          ) {
                                                                              setlastTime(
                                                                                  player.current.getState()
                                                                                      ?.player
                                                                                      ?.currentTime,
                                                                              )
                                                                              setTimeout(
                                                                                  () => {
                                                                                      if (
                                                                                          !paused
                                                                                      ) {
                                                                                          player.current.play()
                                                                                      }
                                                                                  },
                                                                                  0,
                                                                              )
                                                                          }
                                                                      }
                                                                  }}
                                                                  className={`${
                                                                      qualityValue ===
                                                                      el?.quality
                                                                          ? classes.active
                                                                          : ''
                                                                  }`}
                                                              >
                                                                  {el?.quality}
                                                              </MenuItem>
                                                          ),
                                                      )
                                                : ''}
                                        </MenuList>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={() => setOpen2(false)}>
                    <div
                        className="setting-menu"
                        onMouseEnter={handleToggle2}
                        onMouseLeave={handleToggle2}
                    >
                        <Button
                            ref={anchorRef2}
                            aria-controls={open2 ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            disableRipple
                            className={classes.btn}
                        >
                            {t('movie.speed')}{' '}
                            <span className="value">({speedValue}x)</span>
                        </Button>
                        <Popper
                            open={open2}
                            anchorEl={anchorRef2.current}
                            role={undefined}
                            className={`${classes.paper} ${classes.speed}`}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'right'
                                                ? 'right top'
                                                : 'right bottom',
                                    }}
                                >
                                    <Paper>
                                        <MenuList
                                            autoFocusItem={open2}
                                            id="menu-list-grow"
                                            onKeyDown={handleListKeyDown}
                                        >
                                            {speedValues.map((el, index) => (
                                                <MenuItem
                                                    key={index}
                                                    className={
                                                        speedValue === el
                                                            ? classes.active
                                                            : ''
                                                    }
                                                    onClick={() => {
                                                        setSpeedValue(el)
                                                        setOpen2(false)
                                                        setPlayerSpeed(
                                                            el,
                                                            player,
                                                        )
                                                        setPopUpSetting(false)
                                                        setMainMenu(false)
                                                    }}
                                                >
                                                    {el}x
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                </ClickAwayListener>
            </div>
        </div>
    )
}

export default MoviePlayerSettings
