import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        create: 'create.html',
        edit: 'edit.html',
      }
    }
  }
})