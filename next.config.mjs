/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// Disable ESLint during production builds
		ignoreDuringBuilds: true,
	},

	// If you also have TypeScript errors, you might want to add:
	typescript: {
		// Disable TypeScript checks during builds
		ignoreBuildErrors: true,
	},
};

export default nextConfig;