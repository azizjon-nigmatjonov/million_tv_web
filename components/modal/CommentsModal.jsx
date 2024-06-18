import React from 'react'
import Dialog from '@mui/material/Dialog'
import { makeStyles } from '@material-ui/core/styles'
import MainButton from '../../components/button/MainButton'
import Collapse from '@mui/material/Collapse'
import {
    DislikeIconWhite,
    FavoriteLikeIconWhite,
    CommentsUnCheckedIcon,
    CommentsCheckedIcon,
} from '../svg'
import { useTranslation } from 'i18n'
import cls from './Modal.module.scss'

const useStyles = makeStyles({
    paper: {
        background: '#010614',
        border: 0,
        borderRadius: 12,
        color: 'white',
        padding: '30px 40px',
    },
})

const CommentsModal = ({
    commentsModalOpen,
    handleCloseCommentsModalClose,
    commentsLike,
    toggleComment,
    sendLikesData,
    setTypeOfComment,
    sendDislikesData,
    toggleCommentDislike,
    commentsDislike,
}) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const [openDislike, setOpen] = React.useState(false)
    const [openLike, setOpenLike] = React.useState(false)

    const handleClick = () => {
        if (openLike == false && openDislike == false) {
            setOpen(true)
        }
        if (openLike == false && openDislike == true) {
            setOpen(false)
        }
        if (openLike == true) {
            setOpenLike(false)
            setOpen(true)
        }
        setTypeOfComment('dislike')
    }

    const handleClickLike = () => {
        if (openLike == false && openDislike == false) {
            setOpenLike(true)
        }
        if (openLike == true && openDislike == false) {
            setOpenLike(false)
        }
        if (openDislike == true) {
            setOpen(false)
            setOpenLike(true)
        }
        setTypeOfComment('like')
    }

    return (
        <Dialog
            BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.1)' } }}
            open={commentsModalOpen}
            onClose={handleCloseCommentsModalClose}
            classes={{ paper: classes.paper }}
        >
            <div className="w-full sm:min-w-[350px]">
                <h2 className="text-[28px] font-[600] text-center">
                    {t('rate-the-movie')}
                </h2>
                <div className="flex items-center space-x-[48px] justify-center mt-[28px] mb-[16px]">
                    <button
                        onClick={handleClick}
                        className={`${
                            openDislike ? 'bg-[#03A9F4]' : 'bg-[#383641]'
                        } flex items-center justify-center w-[80px] h-[80px] rounded-full`}
                    >
                        <DislikeIconWhite />
                    </button>
                    <button
                        onClick={handleClickLike}
                        className={`${
                            openLike ? 'bg-[#03A9F4]' : 'bg-[#383641]'
                        } flex items-center justify-center w-[80px] h-[80px] rounded-full`}
                    >
                        <FavoriteLikeIconWhite />
                    </button>
                </div>
                <div>
                    <Collapse in={openDislike} timeout="auto" unmountOnExit>
                        {commentsDislike?.map((item, index, row) => (
                            <div
                                key={index}
                                className={
                                    index + 1 === row.length
                                        ? `${cls.commentsInputWrapper}`
                                        : `${cls.commentsInputWrapper} border-b-[1px] border-solid border-[rgba(255,255,255,0.1)]`
                                }
                            >
                                <input
                                    type="checkbox"
                                    id={`customCheck1-${item.id}`}
                                    checked={item.checked}
                                    onChange={() =>
                                        toggleCommentDislike(item.id)
                                    }
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor={`customCheck1-${item.id}`}
                                >
                                    <span className="w-[90%]">{item.name}</span>
                                    {item.checked ? (
                                        <CommentsCheckedIcon />
                                    ) : (
                                        <CommentsUnCheckedIcon />
                                    )}
                                </label>
                            </div>
                        ))}
                    </Collapse>
                    <Collapse in={openLike} timeout="auto" unmountOnExit>
                        {commentsLike?.map((item, index, row) => (
                            <div
                                key={index}
                                className={
                                    index + 1 === row.length
                                        ? `${cls.commentsInputWrapper}`
                                        : `${cls.commentsInputWrapper} border-b-[1px] border-solid border-[rgba(255,255,255,0.1)]`
                                }
                            >
                                <input
                                    type="checkbox"
                                    id={`customCheck1-${item.id}`}
                                    checked={item.checked}
                                    onChange={() => toggleComment(item.id)}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor={`customCheck1-${item.id}`}
                                >
                                    <span className="w-[90%]">{item.name}</span>
                                    {item.checked ? (
                                        <CommentsCheckedIcon />
                                    ) : (
                                        <CommentsUnCheckedIcon />
                                    )}
                                </label>
                            </div>
                        ))}
                    </Collapse>
                    {openLike ? (
                        <MainButton
                            onClick={sendLikesData}
                            text={t('confirm_Button')}
                            type="submit"
                            additionalClasses={`w-full rounded-[8px] bg-[#03A9F4] text-xl mt-[32px] bgHoverBlue h-[56px]`}
                        />
                    ) : (
                        <MainButton
                            onClick={sendDislikesData}
                            text={t('confirm_Button')}
                            type="submit"
                            additionalClasses={`w-full rounded-[8px] bg-[#03A9F4] text-xl mt-[32px] bgHoverBlue h-[56px]`}
                        />
                    )}
                </div>
            </div>
        </Dialog>
    )
}

export default CommentsModal
