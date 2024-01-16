import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'

const root = resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": resolve(root),
			"@components": resolve(root, 'components'),
			"@lib": resolve(root, 'lib'),
			"@schemas": resolve(root, 'lib/schemas'),
			"@stores": resolve(root, 'lib/stores'),
			"@hooks": resolve(root, 'lib/hooks'),
			"@routes": resolve(root, 'routes'),
		}
	}
})
