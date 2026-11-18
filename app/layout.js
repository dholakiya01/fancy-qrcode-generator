import "./globals.css";
export const metadata = {
  title: "Fancy QR Studio",
  description: "Create beautiful branded QR codes.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
