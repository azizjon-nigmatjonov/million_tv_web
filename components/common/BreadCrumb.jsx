import { BreadcrumbArrow } from 'components/svg'
import NextLink from './link'

const Breadcrumb = ({ list, additionalClasses }) => {
    return (
        <nav
            className={`${additionalClasses} bg-grey-light rounded font-sans w-full my-6 hidden md:block `}
        >
            <ol className="list-reset flex text-grey-dark text-white items-center space-x-2">
                {list?.map((item, index) => (
                    <li key={item.id || index} className="flex items-center">
                        {index === list.length - 1 ? (
                            <div className="capitalize text-8 leading-12 whitespace-pre mr-2 text-white text-[12px] md:text-base">
                                {item.text}
                            </div>
                        ) : (
                            <NextLink href={item.link}>
                                <a className="capitalize text-8 leading-12 whitespace-pre mr-2 text-white opacity-50 text-[12px] md:text-base">
                                    {item.text}
                                </a>
                            </NextLink>
                        )}
                        {index !== list.length - 1 && <BreadcrumbArrow />}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumb
