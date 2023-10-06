import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { VitePlugin } from '@electron-forge/plugin-vite';
import path from 'node:path';
const config: ForgeConfig = {
  packagerConfig: {
    "extraResource": [path.resolve(__dirname, 'electron/bin')]
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      "name": "save_hub_tube",
      "setupIcon": "public/icon.ico",
      "setupExe": "Save Hub Tube-Windows-Setup.exe"
    }),
    new MakerZIP({}, ['darwin']),
    new MakerDMG({
      "name": "Save Hub Tube",
      "icon": "public/icon.icns"
    }),
    new MakerRpm({}),
    new MakerDeb({
      "options": {
        "icon": "public/icon.png",
        "name": "save_hub_tube"
      }
    })
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'electron/main/main.ts',
          config: 'vite.main.config.ts',
        },
        {
          entry: 'electron/preload/preload.ts',
          config: 'vite.preload.config.ts',
        },
        {
          entry: 'electron/services/ytDlpWrapper.ts',
          config: 'vite.ytDlpWrapper.config.ts',
        }
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
};

export default config;
