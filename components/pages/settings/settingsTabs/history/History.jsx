import React, { useEffect, useState, useRef } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import style from '../../Settings.module.scss'
import moment from 'moment'
import axios from '../../../../../utils/axios'
import Pagination from './Pagination'
import { useTranslation } from 'i18n'
import Lottie from 'lottie-web'
import { parseCookies } from 'nookies'
import { PaymeTransactionsIcon } from 'components/svg'
import NoCards from '../../../../errorPopup/NoCards'
import { HistoryTransactionIcon } from 'components/svg'

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#161616',
        color: '#fff',
        '@media screen and (max-width: 769px)': {
            fontSize: '15px',
            lineHeight: '20px',
            padding: '16px 8px',
        },
        '&:nth-of-type(2n)': {
            width: '40%',
        },
    },
    body: {
        fontSize: 14,
        color: '#fff',
        '@media screen and (max-width: 769px)': {
            backgroundColor: '#262626',
            padding: '6px 8px',
        },
    },
    root: {
        boxShadow: 'inset -1px -1px 0px rgba(255, 255, 255, 0.1) !important',
        border: 'none !important',
        '@media screen and (max-width: 769px)': {
            boxShadow: 'none !important',
        },
    },
}))(TableCell)

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(2n)': {
            backgroundColor: '#161616',
            '@media screen and (max-width: 769px)': {
                backgroundColor: 'transparent',
            },
        },
    },
}))(TableRow)
const StyledTableContainer = withStyles((theme) => ({
    root: {
        borderRadius: '8px',
        backgroundColor: '#262626',
        '@media screen and (max-width: 769px)': {
            backgroundColor: 'transparent',
        },
    },
}))(TableContainer)

const useStyles = makeStyles({
    table: {
        minWidth: '60vw',
        '@media screen and (max-width: 1140px)': {
            minWidth: '50vw',
        },
        '@media screen and (max-width: 768px)': {
            minWidth: '100%',
        },
        height: 'auto',
    },
    root: {
        padding: '16px 0 !important',
        '& .Mui-selected': {
            backgroundColor: '#007aff !important',
            color: '#fff',
        },
        '& ul': {
            color: '#C6C6C6 !important',
            justifyContent: 'flex-end !important',
        },
    },
})

export default function History() {
    const classes = useStyles()
    const [items, setItems] = useState({})
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()
    const loadingAnim = useRef()
    const { user_id } = parseCookies()

    useEffect(() => {
        getItems()
    }, [currentPage])

    const clearItems = () => {
        setItems((prev) => ({ count: prev.count }))
    }

    useEffect(() => {
        if (loading)
            Lottie.loadAnimation({
                container: loadingAnim.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: require('../../../../../public/data.json'),
            })
    }, [loading])

    const getItems = () => {
        clearItems()
        setLoading(true)
        axios
            .get(`client/${user_id}/transactions?limit=10&page=${currentPage}`)
            .then((res) => {
                setItems(res.data)
            })
            .finally(() => setLoading(false))
    }

    return (
        <>
            <div
                className={
                    items?.count > 0 ? style.table : 'invisible absolute'
                }
            >
                <TableContainer component={Paper}>
                    <StyledTableContainer>
                        {/* {items?.count > 0 ? ( */}
                        <Table
                            className={classes.table}
                            aria-label="customized table"
                        >
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Дата и времья
                                    </StyledTableCell>
                                    <StyledTableCell align="left">
                                        Стоимость транзакции
                                    </StyledTableCell>

                                    <StyledTableCell align="left">
                                        {t('operator')}
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            {loading ? (
                                <div
                                    className={style.loading}
                                    ref={loadingAnim}
                                />
                            ) : (
                                <TableBody>
                                    {items?.transactions?.map(
                                        (transactions) => (
                                            <StyledTableRow
                                                key={transactions.name}
                                            >
                                                <StyledTableCell align="left">
                                                    {`${moment(
                                                        transactions.created_at,
                                                    ).format('L')}, ${moment(
                                                        transactions.created_at,
                                                    ).format('LT')}`}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {transactions.amount / 100}{' '}
                                                    сум
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <button
                                                        className={style.status}
                                                    >
                                                        {transactions.method
                                                            .operator ===
                                                        'Payme' ? (
                                                            <PaymeTransactionsIcon />
                                                        ) : (
                                                            ''
                                                        )}
                                                    </button>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ),
                                    )}
                                </TableBody>
                            )}
                        </Table>
                        {/* ) : (
                        ''
                    )} */}
                        <Pagination
                            onChange={(pageNumber) =>
                                setCurrentPage(pageNumber)
                            }
                            count={items?.count}
                            shape="rounded"
                        />
                    </StyledTableContainer>
                </TableContainer>
            </div>
            {items?.count === 0 && (
                <NoCards
                    // icon={<HistoryTransactionIcon />}
                    button={{
                        onclick: () => {},
                        text: t('buy_subscription'),
                    }}
                    title={t('no_data_history')}
                    text={t('no_history_text')}
                />
            )}
        </>
    )
}
