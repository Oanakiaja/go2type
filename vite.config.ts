// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'go2type',
      // the proper extensions will be added
      fileName: 'go2type'
    },
}
})
