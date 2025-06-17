/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config: {
        module: {
            rules: { test: RegExp; use: { loader: string; options: object }[] }[];
        };
    }) {
        // Configuración para cargar archivos SVG
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {},
                },
            ],
        });

        return config;
    },
};

module.exports = nextConfig;
