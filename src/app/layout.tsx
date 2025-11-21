import "./globals.css";
<<<<<<< HEAD
=======
import { PlayerProvider } from "./music/@context/PlayerContext"; // adjust if needed
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
<<<<<<< HEAD
        {children}
=======
        <PlayerProvider>{children}</PlayerProvider>
>>>>>>> 81ef279003a6e74585b2a69c911e3ed17ffd32d5
      </body>
    </html>
  );
}
