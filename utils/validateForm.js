import * as Yup from 'yup'

// const phoneRegExp =
// /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/

export default function validateForm(name, t) {
    const YupValidation = {
        default: Yup.string()
            .trim(t('Введите имя'))
            .strict(true)
            .required(t('required.field.error')),
        mixed: Yup.mixed().strict(true).required(t('required.field.error')),
        select: Yup.object().typeError(t(' ')).strict(true).required(t(' ')),
        name: Yup.string()
            .trim(t(' '))
            .strict(true)
            .required(t('required_field'))
            .min(3, t('mustBe_More_Than_Character3'))
            .max(30, t('up_To_Character30')),
        date_of_birth: Yup.string().required(t('required_field')),
        house_number: Yup.string()
            .trim(t(' '))
            .strict(true)
            .required(t(' '))
            .min(1, t('mustBe_More_Than_Character1'))
            .max(30, t('up_To_Character30')),

        date: Yup.date().required(t('issued_Date')),
        login: Yup.string()
            .required(t('required.field.error'))
            .min(6, t('login.too.short'))
            .matches(/[a-zA-Z]/, t('only.latin.letters')),
        password: Yup.string()
            .required(t('required_form'))
            .min(6, t('mustBe_More_Than_Character5'))
            .matches(/[a-zA-Z]/, t('only.latin.letters')),
        address: Yup.string()
            .trim(' ')
            .strict(true)
            .required(' ')
            .min(5, t('mustBe_More_Than_Character5'))
            .max(40, t('up_To_Character40')),
        email: Yup.string()
            .email(t('wrong_Email'))
            .required(t('required_form')),
        phone_number: Yup.string()
            .min(6, t('wrong_Phone_Number'))
            .max(17, t('wrong_Phone_Number'))
            .required(t('write_Phone_Number')),
        passport_number: Yup.string()
            .trim(t('spaces.error'))
            .strict(true)
            .min(9, t('invalid.passport.number'))
            .max(9, t('invalid.passport.number'))
            .required(t('required.field.error')),
        tech_passport_number: Yup.string()
            .trim(t('spaces.error'))
            .strict(true)
            .required(t('required.field.error')),
        card: Yup.string()
            .required(' ')
            .min(19, t('mustBe_More_Than_Character16'))
            .max(19, t('up_To_Character16')),
        card_expiry: Yup.string()
            .required(t('incorrect_Date'))
            .matches(/^(0[0-9]|1[0-2])\/([0-9]{2})$/, t('incorrect_Date')),

        year: Yup.string()
            .required(' ')
            .min(2, t('mustBe_More_Than_Character2'))
            .max(2, t('up_To_Character2')),
        month: Yup.number()
            .required(' ')
            .min(1, t('wrong_Answer'))
            .max(12, t('wrong_Answer')),
        driving_license_number: Yup.string()
            .trim(t('spaces.error'))
            .strict(true)
            .required(t('required.field.error')),
        inn: Yup.string()
            .trim(t('spaces.error'))
            .strict(true)
            .min(9, t('invalid.inn'))
            .max(9, t('invalid.inn'))
            .matches(/^\d+$/, t('invalid.inn'))
            .required(t('required.field.error')),
        price: Yup.string()
            // .typeError('Некорректный ввод')
            .required(t(' ')),
        // .test(
        //     'Is positive?',
        //     t('Некорректный ввод'),
        //     (value) => value >= 0,
        // ),
    }

    return YupValidation[name]
}
