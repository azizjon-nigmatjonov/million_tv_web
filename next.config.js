const { nextI18NextRewrites } = require('next-i18next/rewrites')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
const path = require('path')

const localeSubpaths = {
    uz: 'uz',
    en: 'en',
}

module.exports = withBundleAnalyzer({
    images: {
        domains: ['milliontv-cdn.s3.eu-north-1.amazonaws.com'],
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    env: {
        sBASE_URL: 'https://test.api.spec.uzdigital.tv/v1/',
        BASE_URL: 'https://spectator.api.milliontv.uz/v1/',

        sBASE_DOMAIN: 'https://test.dev.uzdigital.tv',
        BASE_DOMAIN: 'https://milliontv.uz/',

        sBASE_IMAGE_UPLOADER: 'https://test.cdn.uzdigital.tv',
        BASE_IMAGE_UPLOADER: 'https://cdn.uzd.udevs.io',
        PROJECT_ID: '956e6cf9-22c1-4465-a48b-9672af4d008d',
        PROJECT_FOLDER_ID: '109611da-f5a4-4da8-b400-c2492da88249',
    },
    publicRuntimeConfig: {
        localeSubpaths,
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        })

        return config
    },
    rewrites: async () => nextI18NextRewrites(localeSubpaths),
    publicRuntimeConfig: {
        localeSubpaths,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
        prependData: `
          @import "./styles/breakpoints.scss";
          @import "./styles/mixins.scss";
          @import "./styles/variables.scss";
          `,
    },
})
