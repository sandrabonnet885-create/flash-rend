export const metadata = {
  title: "404: NOT_FOUND",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000", color: "#ededed" }}>
        {children}
      </body>
    </html>
  );
}
