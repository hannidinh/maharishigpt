import "./global.css"

export const metadata = {
    title: "MaharishiGPT",
    description: "You can ask anything about Maharishi International Univerisity. Sound like I am so in love with my university!",
    icons: {
        icon: "/favicon.ico", // Standard favicon
        apple: "/apple-touch-icon.png", // iOS home screen icon
    }
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

export default RootLayout;