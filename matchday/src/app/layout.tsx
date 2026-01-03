import './global.css'

type RootLayoutT = {
    children: React.ReactNode
}
const RootLayout = ({ children }: RootLayoutT) => (
    <html lang="en">
        <meta name="theme-color" content="#ecd96f" />
        <body>
            <main>{children}</main>
        </body>
    </html>
)
export default RootLayout
