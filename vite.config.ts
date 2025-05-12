import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'LocatorArsLib',
            fileName: (format) => `locator-ars-lib.${format}.js`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: ['vue', 'axios'],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue',
                    axios: 'axios'
                }
            }
        },
        sourcemap: true,
        emptyOutDir: true
    }
}) 