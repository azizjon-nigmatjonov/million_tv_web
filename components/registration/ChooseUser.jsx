import { useState } from 'react'
import { useTranslation } from 'i18n'
import { useFormik } from 'formik'
import validateForm from 'utils/validateForm'
import * as Yup from 'yup'
import { RadioGroup } from '@headlessui/react'
import Image from 'next/image'
import { PlusIcon } from 'components/svg'
import avatarImg from '../../public/images/avatar.png'

const ChooseUser = ({ setStep }) => {
    const { t } = useTranslation('common')
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState({})

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },

        validationSchema: Yup.object({
            email: validateForm('email', t),
            password: validateForm('password', t),
        }),
        onSubmit: (values) => {
            setLoading(true)
            // alert(JSON.stringify(values, null, 2))
            setStep('addUser')
        },
    })

    return (
        <form className="form chooseForm" onSubmit={formik.handleSubmit}>
            <h1 className="form-title capitalize">{t('who?')}</h1>
            <div className="my-8 grid grid-col-1 gap-4">
                <RadioGroup
                    value={selected}
                    onChange={setSelected}
                    className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-7"
                >
                    <RadioGroup.Label className="sr-only">
                        choose avatar
                    </RadioGroup.Label>
                    {/* {cards.map((card) => ( */}
                    <RadioGroup.Option
                        // key={card.card_id}
                        // value={card}
                        className={({ active, checked }) =>
                            `${
                                checked
                                    ? 'border-primary-color bg-primary-color text-white'
                                    : 'border-gray-400'
                            }
                                    mx-auto
                                     card h-28 w-52 flex justify-center hover:cursor-pointer hover:opacity-90`
                        }
                    >
                        {({ active, checked }) => (
                            <>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        <div className="text-sm">
                                            <RadioGroup.Label
                                                as="p"
                                                className={`font-bold ${
                                                    checked
                                                        ? 'text-white'
                                                        : 'text-gray-900'
                                                }`}
                                            >
                                                <Image
                                                    className="rounded-lg"
                                                    src={avatarImg}
                                                    width={80}
                                                    height={80}
                                                    alt=""
                                                />
                                            </RadioGroup.Label>
                                            <RadioGroup.Description
                                                as="span"
                                                className={`inline ${
                                                    checked
                                                        ? 'text-sky-100'
                                                        : 'text-gray-500'
                                                }`}
                                            >
                                                <span className="text-lightGray text-8">
                                                    Fazliddin
                                                </span>
                                            </RadioGroup.Description>
                                        </div>
                                    </div>
                                    {checked && (
                                        <>
                                            <div className="flex-shrink-0 text-primary-color">
                                                <span />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </RadioGroup.Option>
                    <div>
                        <div className="w-20 h-20 bg-darkGray rounded-lg flex items-center justify-center cursor-pointer mb-2">
                            <PlusIcon />
                        </div>
                        <span className="text-lightGray text-8">
                            {t('add')}
                        </span>
                    </div>
                </RadioGroup>
            </div>
            {/* <p className="text-7 leading-8 font-medium">
                <span className="text-textGray">{t('new here?')}</span>{' '}
                <span
                    className="text-white cursor-pointer hover:underline"
                    onClick={() => setStep('signup')}
                >
                    {t('signUp now')}
                </span>
            </p>

             */}
        </form>
    )
}

export default ChooseUser
