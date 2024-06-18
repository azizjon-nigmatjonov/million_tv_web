import CCollapse from 'components/CElements/CCollapse'
import cls from './style.module.scss'
import { List } from './FAQ'
export default function SettingsSupport() {
    return (
        <div className="mobile:w-[550px]">
            {/* <div className={cls.card}>
                <span className={cls.title}>Колл центр:</span>{' '}
                <a className={cls.phone} href="tel:+998991234567">
                    +998 (99) 123 45 67
                </a>
            </div> */}

            {List?.map((item, index) => (
                <CCollapse key={index} element={item} />
            ))}
        </div>
    )
}
