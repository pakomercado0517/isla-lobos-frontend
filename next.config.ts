import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración vacía de Turbopack para desactivarlo y usar webpack
  turbopack: {},
  
  // Configuración de webpack para excluir archivos problemáticos
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignorar archivos de test y archivos auxiliares de thread-stream
      config.resolve = config.resolve || {};
      config.resolve.alias = {
        ...config.resolve.alias,
      };
      
      // Agregar regla para ignorar archivos de test
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      
      config.module.rules.push({
        test: /node_modules\/thread-stream\/(test|bench|README\.md|LICENSE)/,
        use: "ignore-loader",
      });
    }

    return config;
  },
};

export default nextConfig;
