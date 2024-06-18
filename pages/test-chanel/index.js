import React, { useEffect, useState } from 'react'
import { Link } from 'i18n'
import sha1 from 'js-sha1'
import Script from 'next/script'

const TestChanel = () => {
    useEffect(() => {
        flussonic_link_get('RU_TV/video.m3u8')
    }, [])
    const [linkToTv, setLink] = useState()
    let flussonic_link_get = (stream_name) => {
        function seconds_since_epoch(d) {
            return Math.floor(d / 1000)
        }
        var d = new Date()
        var sec = seconds_since_epoch(d)

        let flussonic = 'https://st1.uzdigital.tv'
        let key = 'HJB8FOcAKE7xUCdGtW5lrF4f9uth53WL'
        let lifetime = 3600 * 3
        let stream = 'RU_TV'
        let ipaddr = '89.236.205.221'
        let desync = 300
        let starttime = sec - desync
        let endtime = starttime + lifetime
        let salt = '0ae5a1097e1654a8b82db4ed931096a0'

        let hashsrt = stream + salt + endtime + starttime
        let hash = sha1(hashsrt)

        let token = hash + '-' + salt + '-' + endtime + '-' + starttime

        let link =
            flussonic +
            '/' +
            stream +
            '/embed.html?' +
            token +
            '&remote=' +
            ipaddr

        // return link
        setLink(link)
        console.log(link)
    }

    return (
        <>
            <div className="text-white">
                <Script
                    id="222"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                        let flussonic_link_get = (stream_name) => {

                        var d = new Date();
                        var sec = seconds_since_epoch(d);

                        let flussonic = 'https://st1.uzdigital.tv';
                        let key = 'HJB8FOcAKE7xUCdGtW5lrF4f9uth53WL';
                        let lifetime = 3600 * 3;
                        let stream = stream_name; 
                        let ipaddr = 'no_check_ip';
                        let desync = 300;
                        let starttime = sec - desync;
                        let endtime = starttime + lifetime;
                        let salt = "0ae5a1097e1654a8b82db4ed931096a0"

                        let hashsrt = stream + salt + endtime + starttime
                        let hash = sha1(hashsrt)

                        let token = hash + "-" + salt + "-" + endtime + "-" + starttime

                        let link = flussonic + "/" + stream + "/embed.html?" + token + "&remote=" + ipaddr

                        return link;
                    }
                    `,
                    }}
                />

                {linkToTv && (
                    <Link href={linkToTv}>
                        <a className="text-4xl">Link</a>
                    </Link>
                )}
            </div>
        </>
    )
}

export default TestChanel
