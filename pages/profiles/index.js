import React, { useEffect, useState } from 'react'
import ProfilesListComponent from '../../components/cards/ProfilesList'
import { useSelector } from 'react-redux'

const ProfileUpdate = () => {
    const ProfilesList = useSelector((state) => state.profile.profiles_list)
    const profiles = ProfilesList?.profiles
    useEffect(() => {
        if (profiles) {
            for (let i = 0; i < profiles?.length; i++) {
                if (profiles[i].is_main) {
                    let saver = profiles[0]
                    profiles[0] = profiles[i]
                    profiles[i] = saver
                    return
                }
            }
        }
    }, [profiles])
    return (
        <>
            <div>
                <ProfilesListComponent
                    profiles={profiles}
                    ProfilesList={ProfilesList}
                />
            </div>
        </>
    )
}

export default ProfileUpdate
