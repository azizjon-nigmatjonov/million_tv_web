import { setConfig } from 'next/config'
import config from './next.config'
import { loadEnvConfig } from '@next/env'

// load env
loadEnvConfig(process.cwd())
// Make sure you can use "publicRuntimeConfig" within tests.
setConfig(config)
