# SonicFlow Music Player 🎵

A modern, full-stack music streaming application built with Next.js 15, featuring persistent data storage, cloud-based file management, and a seamless user experience.

![SonicFlow Preview](https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop)

## ✨ Features

- **Authenticated Experience**: Secure Google Authentication via NextAuth.js.
- **Cloud Storage**: Fast and secure song and image uploads using Cloudinary.
- **Persistent Library**: User data (songs, playlists, favourites) is stored permanently in MongoDB.
- **Smart Uploads**: Parallel uploading for high-speed performance with real-time progress tracking.
- **Interactive UI**:
    - Drag-and-drop reordering for playlists and favourites (powered by `@dnd-kit`).
    - Collapsible sidebar for mobile responsiveness.
    - Beautiful, glassmorphic design with Tailwind CSS.
- **Playlist Management**: Create, edit, and customize playlists with cover images.
- **Favourites System**: Quickly mark and access your top tracks.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Storage**: [Cloudinary](https://cloudinary.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas account
- A Cloudinary account
- Google Cloud Console credentials

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/AdityaKishore05/Music-Player.git
    cd Music-Player
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add the following:

    ```env
    # Authentication
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000

    # Database
    MONGODB_URI=your_mongodb_connection_string

    # Cloudinary (Frontend Hardcoded for Unsigned Uploads, but good to keep track)
    # Cloud Name: dlq3akqq4
    # Upload Preset: music-player
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is optimized for deployment on **Netlify**.

1.  Push your code to GitHub.
2.  Import the project in Netlify.
3.  Add the Environment Variables in the Netlify dashboard (Site Settings > Environment variables).
4.  Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).