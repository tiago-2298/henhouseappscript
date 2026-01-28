export const metadata = {
  title: "Hen House",
  description: "Hen House Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
