
import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        reactRefresh(),
        visualizer({
            open: true,
            filename: 'bundle-stats.html',
            gzipSize: true,
            brotliSize: true,
        })
    ],
});
