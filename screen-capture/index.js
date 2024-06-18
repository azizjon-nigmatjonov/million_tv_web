import { CircularProgress, Dialog, Popover } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import {
    BlurIcon,
    CancelIcon,
    DrawRectangleIcon,
    MarkerIcon,
    MessageIcon,
} from './icons'
import styles from './style.module.scss'
import html2canvas from 'html2canvas'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import { createBug, uploadFile } from './services/task'
import { DataURIToBlob } from './utils/convertBase64'
import toast, { Toaster } from 'react-hot-toast'
import ColorPicker from './ColorPicker'
const CanvasDraw = dynamic(() => import('./CanvasDraw'), {
    ssr: false,
})

export default function ScreenCaptureContainer({ children }) {
    const [open, setOpen] = useState(false)
    const popoverRef = useRef()
    const canvasRef = useRef()
    const [loading, setLoading] = useState(false)
    const [tool, setTool] = useState('')
    const [image, setImage] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const [text, setText] = useState('')
    const [title, setTitle] = useState('')
    const [name, setName] = useState('')
    const [color, setColor] = useState('#F31D2F')
    const [anchorElColor, setAnchorElColor] = useState(null)
    const openColor = Boolean(anchorElColor)
    const idColor = openColor ? 'simple-popover' : undefined
    const handleClickColor = (event) => {
        setAnchorElColor(event.currentTarget)
    }

    const switchColor = (item) => {
        setColor(item)
        handleCloseColor()
    }

    const handleCloseColor = () => {
        setAnchorElColor(null)
    }

    const handleClickEditor = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseEditor = () => {
        setAnchorEl(null)
    }

    const openEditor = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    const createNewTask = async () => {
        if (!title && !text) {
            popoverRef.current.click()
            return
        }
        const canvas = await html2canvas(canvasRef.current.attrs.container)
        var base64 = canvas.toDataURL('image/png')
        // let a = document.createElement("a");
        // a.download = "ss.png";
        // a.href = base64;
        // a.click(); // MAY NOT ALWAYS WORK!
        const file = DataURIToBlob(base64)
        const formData = new FormData()
        formData.append('file', file, 'image.png')
        setLoading(true)
        try {
            const uploadRes = await uploadFile(formData)
            // const result = await createSubtask({
            //   description: `<p>${window.location.href}</p>${text}`,
            //   title: `${title} | Frontend Debug | ${name}`
            // })
            // await createSubtaskItem({
            //   ...result.data.data
            // })
            const subtaskFile = await createBug({
                file: uploadRes.data.data,
                subtask_title: `${title} | Frontend Debug | ${name}`,
                subtask_description: `<p>${window.location.href}</p>${text}`,
            })

            if (subtaskFile.status === 201) {
                toast.success('Successfully!')
            }
        } catch (e) {
            toast.error('Error!')
        } finally {
            setLoading(false)
            setOpen(false)
            setTool('')
            setText('')
            setTitle('')
        }
    }

    useEffect(() => {
        const callback = async (event) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.shiftKey &&
                event.code === 'KeyY'
            ) {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    preferCurrentTab: true,
                })
                const video = document.createElement('video')
                video.addEventListener('loadedmetadata', () => {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                    video.play()
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                    stream.getVideoTracks()[0].stop()
                    document.body.appendChild(canvas)
                    setImage(canvas.toDataURL('image/png'))
                    setOpen(true)
                    canvas.remove()
                })
                video.srcObject = stream
                video.remove()
                // html2canvas(document.body, {
                //   x: window.scrollX,
                //   y: window.scrollY,
                //   width: window.innerWidth,
                //   height: window.innerHeight,
                //   logging: true,
                //   letterRendering: 1,
                //   allowTaint: false,
                //   useCORS: true
                // }).then((canvas) => {
                //   setOpen(true);
                //   setImage(canvas.toDataURL("image/png"));
                // });
            }
        }
        document.addEventListener('keydown', callback)
        return () => {
            document.removeEventListener('keydown', callback)
        }
    }, [])

    const handleClose = () => {
        setOpen(false)
        setTool('')
        setText('')
        setTitle('')
        canvasRef.current.clear()
    }

    return (
        <>
            {children}
            {open && (
                <div className={styles.premodal}>
                    <div
                        className={styles.modal}
                        style={{
                            width:
                                typeof window !== 'undefined'
                                    ? `calc(${window.innerWidth}px - 166px)`
                                    : '1200px',
                            height:
                                typeof window !== 'undefined'
                                    ? `calc(${window.innerHeight}px - 90px)`
                                    : '578px',
                        }}
                    >
                        <div className={styles.close} onClick={handleClose}>
                            <CancelIcon />
                        </div>

                        <CanvasDraw
                            open={open}
                            canvasRef={canvasRef}
                            tool={tool}
                            image={image}
                            color={color}
                        />

                        <div className={styles.tools}>
                            {/* <div className={styles.item}>
              <TextIcon />
            </div> */}
                            <div
                                className={classNames(styles.item, {
                                    [styles.active]: tool === 'pen',
                                })}
                                onClick={() => {
                                    setTool('pen')
                                }}
                            >
                                <MarkerIcon />
                            </div>
                            {/* <div className={styles.item}>
              <DrawIcon />
            </div> */}
                            <div
                                className={classNames(styles.item, {
                                    [styles.active]: tool === 'rec',
                                })}
                                onClick={() => {
                                    setTool('rec')
                                }}
                            >
                                <DrawRectangleIcon />
                            </div>
                            <div
                                className={classNames(styles.item, {
                                    [styles.active]: tool === 'color',
                                })}
                            >
                                <div
                                    className={styles.colorPicker}
                                    style={{ backgroundColor: color }}
                                    onClick={(e) => {
                                        setTool('color')
                                        handleClickColor(e)
                                    }}
                                >
                                    <div className={styles.color}></div>
                                </div>
                                <ColorPicker
                                    switchColor={switchColor}
                                    anchorEl={anchorElColor}
                                    handleClose={handleCloseColor}
                                    open={openColor}
                                    id={idColor}
                                />
                            </div>
                            {/* <div className={styles.item}>
              <BlurIcon />
            </div> */}
                            <div
                                className={classNames(styles.item, {
                                    [styles.active]: tool === 'description',
                                })}
                                ref={popoverRef}
                                onClick={(e) => {
                                    setTool('description')
                                    handleClickEditor(e)
                                }}
                            >
                                <MessageIcon />
                                {text && <div className={styles.visible} />}
                            </div>
                            <button onClick={createNewTask} disabled={loading}>
                                {loading ? (
                                    <CircularProgress
                                        color="inherit"
                                        size={15}
                                    />
                                ) : (
                                    'Send'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Popover
                id={id}
                open={openEditor}
                anchorEl={anchorEl}
                onClose={handleCloseEditor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{ horizontal: 400, vertical: 380 }}
            >
                <div className={styles.box}>
                    <div className={styles.input}>
                        <label>Name</label>
                        <input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }}
                        />
                    </div>
                    <div className={styles.input}>
                        <label>Title</label>
                        <input
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                            }}
                        />
                    </div>
                    <div className={styles.input}>
                        <label>Description</label>
                        <ReactQuill
                            theme="snow"
                            style={{
                                height: '200px',
                                color: 'black',
                                backgroundColor: 'white',
                            }}
                            value={text}
                            onChange={setText}
                        />
                        {/* <textarea
              className={styles.editor}
              value={text}
              rows={10}
              onChange={(e) => {
                setText(e.target.value);
              }}
            /> */}
                    </div>
                </div>
            </Popover>
            <Toaster position="top-center" reverseOrder={false} />
        </>
    )
}
