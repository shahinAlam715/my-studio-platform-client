# StudioSpace – Studio Booking Platform

**Live Website:** https://my-studio-platform-client-k9aj.vercel.app

StudioSpace is a modern studio booking platform where users can explore, discover, and book different types of creative spaces. It helps photographers, podcasters, musicians, and other creators find suitable studios based on their needs.

## ✨ Key Features

- **Explore Studios:** Browse different studios, including photography studios, podcast rooms, music suites, sound stages, and art workshops.
- **Studio Details:** View studio information, descriptions, pricing, location, and available facilities.
- **Authentication:** Secure user authentication with email and Google sign-in using Better Auth.
- **Studio Management:** Authenticated users can add, update, and delete their own studio listings.
- **My Listings:** Users can manage and view the studios they have listed.
- **Responsive Design:** Fully responsive user interface for desktop, tablet, and mobile devices.
- **Search & Filtering:** Find studios using search, category, and price filters.
- **Modern UI:** Clean dark-themed interface with a gold accent color and reusable UI components.

## 🛠️ Technology Stack

### Frontend
- Next.js
- React.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Next Themes

### Authentication & Backend
- Better Auth
- Node.js
- Express.js
- MongoDB

### Deployment
- Vercel

## 🚀 Local Setup Instructions

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

### 2. Navigate to the Project Folder

```bash
cd my-studio-platform-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory and add the required environment variables.

```env
NEXT_PUBLIC_API_URL=YOUR_BACKEND_API_URL
```

Add any additional Better Auth environment variables required by your project configuration.

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Open the Website

Visit:

```text
https://my-studio-platform-client-k9aj.vercel.app
```

## 🔐 Examiner Test Credentials

Use the following credentials to test the application.

**Test User Account**

- Email: `YOUR_EXAMINER_TEST_EMAIL`
- Password: `YOUR_EXAMINER_TEST_PASSWORD`

> Replace these placeholders with valid test account credentials before submission.

## 📁 Project Structure

```text
my-studio-platform-client/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── .env.local
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 📌 Important Notes

- Make sure the backend server is deployed and accessible before testing API-related features.
- Configure the correct backend API URL in `.env.local`.
- Never commit private environment variables or sensitive credentials to GitHub.
- Use the live website link above to access the deployed application.

---

**Developed with ❤️ for creative professionals.**
