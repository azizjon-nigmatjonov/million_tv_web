import { Avatar, Chip, withStyles } from '@material-ui/core'
import React from 'react'
import { Router } from 'i18n'
import { useTranslation } from 'i18n'

export default function InfoParsons({ el }) {
    const { t } = useTranslation()

    const StyleChip = withStyles({
        avatar: {
            width: '32px !important',
            height: '32px !important',
        },
    })(Chip)
    return (
        <div className="px-4 md:px-[50px] mb-16">
            <h2
                style={{
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '28px',
                    lineHeight: '34px',
                    letterSpacing: '0.41px',
                    marginBottom: '24px',
                }}
            >
                {t('Cast')}
            </h2>
            {el?.staffs?.map((item, i) => (
                <>
                    {item.type === 'ROLE' || item.position === 'actor' ? (
                        <StyleChip
                            key={i}
                            avatar={
                                el.is_megago ? (
                                    item.avatar.image_240x240.length > 0 ? (
                                        <Avatar
                                            alt={item.name}
                                            src={item.avatar.image_240x240}
                                        />
                                    ) : null
                                ) : item?.staff?.photo?.length > 0 ? (
                                    <Avatar
                                        alt={item?.staff?.first_name}
                                        src={item?.staff?.photo}
                                    />
                                ) : null
                            }
                            label={
                                item.name ||
                                item?.staff?.first_name +
                                    ' ' +
                                    item?.staff?.last_name
                            }
                            variant="outlined"
                            onClick={() =>
                                Router.push(`/actor/${item?.staff?.slug}`)
                            }
                            style={{
                                height: '36px',
                                backgroundColor: '#262626',
                                color: '#fff',
                                fontSize: '15px',
                                lineHeight: '20px',
                                letterSpacing: '-0.24px',
                                marginRight: '16px',
                                marginBottom: '12px',
                            }}
                        />
                    ) : null}
                </>
            ))}
        </div>
    )
}
