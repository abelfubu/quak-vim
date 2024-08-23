import { context } from 'esbuild'
import copyPlugin from 'esbuild-plugin-copy'

const ctx = await context({
  entryPoints: [
    './src/content.ts',
    './src/background.ts',
    './src/manifest.json',
  ],
  outdir: 'dist',
  bundle: true,
  minify: true,
  assetNames: '[name]',
  loader: {
    '.json': 'file',
    '.css': 'text',
  },
  plugins: [
    copyPlugin({
      assets: {
        from: './src/assets/*', // Source folder
        to: './assets', // Destination folder in the output directory
      },
    }),
  ],
})

ctx
  .watch()
  .then(() => console.log('Building...'))
  .catch(console.error)
