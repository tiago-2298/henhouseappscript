export const metadata = {
  title: "Hen House",
  description: "Portail Hen House",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
