import esbuild from 'esbuild'
import copyPlugin from 'esbuild-plugin-copy'

esbuild
  .build({
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
        // Optional: Enable watch mode (for development)
        // watch: true,
      }),
    ],
  })
  .catch(() => process.exit(1))
