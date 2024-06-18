import Collapse from '@mui/material/Collapse'
import cls from './style.module.scss'
import { MovieFilterListItem } from './ListItem'
export default function MovieFilterSelectMenu({
    isOpen,
    height,
    leftWidth,
    rightWidth,
    position,
    columns,
    leftList,
    rightList,
    handleClickElement = () => {},
}) {
    const style = {
        top: position.y,
        left: position.x,
    }

    return (
        <div className={cls.selectMenu} style={style}>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <div className={cls.list} style={{ height: `${height}px` }}>
                    {columns > 1 ? (
                        <div className={cls.multpleWrapper}>
                            <ul
                                style={{
                                    width: `${
                                        leftWidth == '100%'
                                            ? '100%'
                                            : leftWidth + 'px'
                                    }`,
                                }}
                            >
                                {leftList.map((item) => (
                                    <MovieFilterListItem
                                        key={item.value}
                                        element={item}
                                        handleClickElement={handleClickElement}
                                    />
                                ))}
                            </ul>
                            <ul
                                style={{
                                    width: `${
                                        rightWidth === '100%'
                                            ? '100%'
                                            : rightWidth + 'px'
                                    }`,
                                }}
                            >
                                {rightList.map((item) => (
                                    <MovieFilterListItem
                                        key={item.value}
                                        element={item}
                                        handleClickElement={handleClickElement}
                                    />
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <ul
                            style={{
                                width: `${
                                    leftWidth == '100%'
                                        ? '100%'
                                        : leftWidth + 'px'
                                }`,
                            }}
                        >
                            {leftList.map((item) => (
                                <MovieFilterListItem
                                    key={item.value}
                                    element={item}
                                    handleClickElement={handleClickElement}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </Collapse>
        </div>
    )
}
