module.exports = function (api) {
  api.cache(true);

  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
            "@/app": "./app",
            "@/components": "./components",
            "@/hooks": "./hooks",
            "@/constants": "./constants",
            "@/theme": "./theme",
            "@/utils": "./utils",
            "@/types": "./types",
            "@/data": "./data",
            "@/animations": "./animations",
            "@/services": "./services",
            "@/store": "./store",
          },
          extensions: [".ios.ts", ".android.ts", ".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      ],
      "nativewind/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
