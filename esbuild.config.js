import esbuild from 'esbuild';

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
  })
  .catch(() => process.exit(1));
