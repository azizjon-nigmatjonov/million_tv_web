import { SettingsIconPlayer, ArrowLeft, CheckIconCards } from 'components/svg'
import useDidUpdate from 'hooks/useDidUpdate'
import React, { useState } from 'react'
import { useTranslation } from 'i18n'

export default function QualityButton({
    data,
    source,
    player,
    lastTime,
    setlastTime,
    setSource,
    paused,
    isTrailer,
    refQuality,
    setEpisodeOpen,
    setNextEpisode,
    setQualityOpen,
    qualityOpen,
    setNewTrack,
}) {
    const [open, setOpen] = useState(false)
    const [active, setActive] = useState('auto')

    const { t } = useTranslation()

    useDidUpdate(() => {
        if (player.current) {
            player.current.seek(lastTime)
            if (!paused) {
                player.current.play()
            }
        }
    }, [source])

    function handleQualty(element) {
        if (element?.quality === 'auto')
            setSource(data?.videos?.find((i) => i.quality === '480p'))
        else setSource(element)
    }

    return (
        <>
            <div
                onClick={(e) => {
                    setQualityOpen(false)
                }}
                className={
                    qualityOpen
                        ? 'block absolute z-[99999999999999999999999999999999999999999] top-[-85vh] left-0 w-full h-[100vh]'
                        : 'hidden'
                }
            />
            <div ref={refQuality} className="button_qualities">
                <button
                    onClick={() => {
                        setQualityOpen(!qualityOpen)
                        setEpisodeOpen(false)
                        setNextEpisode(false)
                    }}
                    className="button"
                >
                    <SettingsIconPlayer width="30" fill="white" />
                </button>
                <div
                    className={qualityOpen ? 'cont cont_active scroll' : 'cont'}
                >
                    <div
                        className="header"
                        onClick={() => setQualityOpen(false)}
                    >
                        <ArrowLeft width="25" stroke="#8b97b0" />
                        <p className="text">{t('quality')}</p>
                    </div>
                    {isTrailer === false && data?.default && (
                        <span>
                            <div
                                onClick={() => {
                                    setNewTrack(null)
                                    setOpen(false)
                                    setQualityOpen(false)
                                    setActive('auto')
                                    setSource(data?.default)
                                    if (player.current) {
                                        setlastTime(
                                            player.current.getState()?.player
                                                ?.currentTime,
                                        )
                                        setTimeout(() => {
                                            if (!paused) {
                                                player.current.play()
                                            }
                                        }, 0)
                                    }
                                }}
                                className="buttons"
                            >
                                {t('autoVideoPlay')}
                                {active === 'auto' ? <CheckIconCards /> : ''}
                            </div>
                        </span>
                    )}
                    {isTrailer === false
                        ? data?.videos
                              ?.sort((a, b) => {
                                  return a.quality - b.quality
                              })
                              .map((el, ind) => {
                                  return (
                                      <div
                                          key={ind}
                                          onClick={() => {
                                              setNewTrack(null)
                                              setOpen(false)
                                              setQualityOpen(false)
                                              setActive(el.quality)
                                              handleQualty(el)
                                              if (player.current) {
                                                  setlastTime(
                                                      player.current.getState()
                                                          ?.player?.currentTime,
                                                  )
                                                  setTimeout(() => {
                                                      if (!paused) {
                                                          player.current.play()
                                                      }
                                                  }, 0)
                                              }
                                          }}
                                          className="buttons"
                                      >
                                          {el?.quality === 'auto'
                                              ? t('autoVideoPlay')
                                              : el?.quality}
                                          {active === el?.quality ? (
                                              <CheckIconCards fill="white" />
                                          ) : (
                                              ''
                                          )}
                                      </div>
                                  )
                              })
                        : (data ? data : [])?.map((el, ind) =>
                              el ? (
                                  <div
                                      key={ind}
                                      onClick={() => {
                                          setNewTrack(null)
                                          setOpen(false)
                                          setQualityOpen(false)
                                          setActive(el?.quality)
                                          setSource(el)
                                          if (player.current) {
                                              setlastTime(
                                                  player.current.getState()
                                                      ?.player?.currentTime,
                                              )
                                              setTimeout(() => {
                                                  if (!paused) {
                                                      player.current.play()
                                                  }
                                              }, 0)
                                          }
                                      }}
                                      className="buttons"
                                  >
                                      {el?.quality === 'auto'
                                          ? t('autoVideoPlay')
                                          : el?.quality}
                                      {active === el?.quality ? (
                                          <CheckIconCards fill="white" />
                                      ) : (
                                          ''
                                      )}
                                  </div>
                              ) : null,
                          )}
                </div>
            </div>
            {open && (
                <div onClick={() => setOpen(false)} className="background" />
            )}
        </>
    )
}
