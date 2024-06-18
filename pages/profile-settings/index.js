import React, { useState } from 'react'
import ProfileSettings from '../../components/pages/ProfileSettings'
import { fetchMultipleUrls } from 'utils/fetchMultipleUrls'

const ProfileUpdate = ({ movies }) => {
    const [currentPage, setCurrentPage] = useState(1)

    return (
        <>
            <ProfileSettings
                data={movies ? movies.movies : []}
                setCurrentPage={setCurrentPage}
            />
        </>
    )
}

export default ProfileUpdate

export async function getServerSideProps(ctx) {
    const urls = [
        {
            endpoint: `movies?limit=100&page=1`,
        },
    ]

    const [movies] = await fetchMultipleUrls(urls, ctx)

    return {
        props: {
            movies: movies ?? [],
        },
    }
}
