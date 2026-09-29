import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VeriCert API | Next-Gen Blockchain Credential Platform",
  description: "Tamper-proof academic and professional certificate verification powered by Polygon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#0b0f17", color: "#f8fafc" }}>
        {children}
      </body>
    </html>
  );
}
