export default {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#0f172a",
                mist: "#f8fafc",
                primary: {
                    50: "#eef9ff",
                    100: "#d8f1ff",
                    500: "#1696d2",
                    600: "#0d7cad",
                    700: "#0a617f",
                },
                accent: {
                    100: "#fff1cc",
                    300: "#ffd166",
                    500: "#f59e0b",
                },
                mint: {
                    100: "#dff7ef",
                    500: "#33b07a",
                },
            },
            boxShadow: {
                panel: "0 18px 45px rgba(15, 23, 42, 0.08)",
            },
            fontFamily: {
                sans: ["SF Pro Display", "PingFang SC", "Microsoft YaHei", "sans-serif"],
            },
            backgroundImage: {
                hero: "radial-gradient(circle at top left, rgba(22, 150, 210, 0.18), transparent 35%), radial-gradient(circle at top right, rgba(245, 158, 11, 0.18), transparent 28%), linear-gradient(135deg, #ffffff 0%, #f6fbff 52%, #fefbf3 100%)",
            },
        },
    },
    plugins: [],
};
