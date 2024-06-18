import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Line, Image, Rect } from 'react-konva'
import styles from './style.module.scss'
import useImage from 'use-image'
import classNames from 'classnames'

const URLImage = ({ image }) => {
    const [img] = useImage(image)
    return (
        <Image
            image={img}
            x={0}
            y={0}
            // I will use offset to set origin to the center of the image
            offsetX={0}
            offsetY={0}
            width={
                typeof window !== 'undefined'
                    ? window.innerWidth - 166
                    : '1200px'
            }
            height={
                typeof window !== 'undefined'
                    ? window.innerHeight - 90
                    : '578px'
            }
        />
    )
}

export default function CanvasDraw({ tool, image, canvasRef, open, color }) {
    const [lines, setLines] = useState([])
    const [annotations, setAnnotations] = useState([])
    const [newAnnotation, setNewAnnotation] = useState([])
    const isDrawing = useRef(false)

    useEffect(() => {
        if (!open) {
            setAnnotations([])
            setNewAnnotation([])
            setLines([])
        }
    }, [open])

    const handleMouseDown = (e) => {
        if (tool !== 'pen' && tool !== 'rec') {
            return
        }
        if (tool === 'pen') {
            isDrawing.current = true
            const pos = e.target.getStage().getPointerPosition()
            setLines([...lines, { tool, points: [pos.x, pos.y], color }])
        }
        if (tool === 'rec') {
            if (newAnnotation.length === 0) {
                const { x, y } = e.target.getStage().getPointerPosition()
                setNewAnnotation([
                    { x, y, width: 0, height: 0, key: '0', color },
                ])
            }
        }
    }

    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (tool === 'pen') {
            if (!isDrawing.current) {
                return
            }
            const stage = e.target.getStage()
            const point = stage.getPointerPosition()
            let lastLine = lines[lines.length - 1]
            // add point
            lastLine.points = lastLine.points.concat([point.x, point.y])

            // replace last
            lines.splice(lines.length - 1, 1, lastLine)
            setLines(lines.concat())
        }
        if (tool === 'rec') {
            if (newAnnotation.length === 1) {
                const sx = newAnnotation[0].x
                const sy = newAnnotation[0].y
                const { x, y } = e.target.getStage().getPointerPosition()
                setNewAnnotation([
                    {
                        x: sx,
                        y: sy,
                        width: x - sx,
                        height: y - sy,
                        key: '0',
                        color,
                    },
                ])
            }
        }
    }

    const handleMouseUp = (e) => {
        if (tool === 'pen') {
            isDrawing.current = false
        }
        if (tool === 'rec') {
            if (newAnnotation.length === 1) {
                const sx = newAnnotation[0].x
                const sy = newAnnotation[0].y
                const { x, y } = e.target.getStage().getPointerPosition()
                const annotationToAdd = {
                    x: sx,
                    y: sy,
                    width: x - sx,
                    height: y - sy,
                    key: annotations.length + 1,
                    color,
                }
                annotations.push(annotationToAdd)
                setNewAnnotation([])
                setAnnotations(annotations)
            }
        }
    }

    const annotationsToDraw = [...annotations, ...newAnnotation]

    return (
        <>
            <Stage
                width={
                    typeof window !== 'undefined'
                        ? window.innerWidth - 166
                        : '1200px'
                }
                height={
                    typeof window !== 'undefined'
                        ? window.innerHeight - 90
                        : '578px'
                }
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                className={classNames(styles.canvasContainer, {
                    [styles.isPencil]: tool === 'pen',
                    [styles.isRec]: tool === 'rec',
                })}
            >
                <Layer>
                    <URLImage image={image} />
                    {annotationsToDraw.map((value, i) => {
                        return (
                            <Rect
                                key={value[i]}
                                x={value.x}
                                y={value.y}
                                width={value.width}
                                height={value.height}
                                fill="transparent"
                                stroke={value.color}
                                strokeWidth={3}
                            />
                        )
                    })}
                    {lines.map((line, i) => (
                        <Line
                            key={line[i]}
                            points={line.points}
                            stroke={line.color}
                            strokeWidth={3}
                            tension={0.5}
                            lineCap="round"
                            globalCompositeOperation={
                                line.tool === 'eraser'
                                    ? 'destination-out'
                                    : 'source-over'
                            }
                        />
                    ))}
                </Layer>
            </Stage>
        </>
    )
}
