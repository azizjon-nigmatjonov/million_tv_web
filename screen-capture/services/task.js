import axios from 'axios'

export async function createBug(data) {
    return await axios.post('https://api.upm.udevs.io/bug-report', {
        ...data,
        project_id: process.env.PROJECT_ID,
    })
}

export async function uploadFile(formData) {
    return await axios.post(
        `https://ufs.udevs.io/v1/file/${process.env.PROJECT_FOLDER_ID}`,
        formData,
        {
            headers: {
                'Content-Type': 'mulpipart/form-data',
            },
        },
    )
}
