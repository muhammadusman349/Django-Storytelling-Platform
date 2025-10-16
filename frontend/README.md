# StoryVerse Frontend

A modern, interactive storytelling platform built with React and Django. Create, share, and experience stories where every choice matters.

## 🚀 Features

### ✅ **Authentication System**
- User registration and login
- JWT token management with auto-refresh
- Protected routes and user sessions
- Password validation and security

### ✅ **Story Management**
- Create and edit interactive stories
- Rich text editing with cover images
- Story categorization and tagging
- Draft and publish workflow

### ✅ **Interactive Reading Experience**
- Chapter-based story navigation
- Decision points and voting system
- Real-time community choices
- Branching narrative paths

### ✅ **Social Features**
- Like and share stories
- Follow other authors
- User profiles and portfolios
- Community engagement

### ✅ **Modern UI/UX**
- Responsive dark theme design
- Smooth animations with Framer Motion
- Glass morphism effects
- Mobile-first approach

### ✅ **Dashboard & Analytics**
- Author dashboard with story management
- Performance analytics and insights
- Story statistics and engagement metrics
- User activity tracking

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form validation
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library
- **Axios** - HTTP client with interceptors

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Django-Storytelling-plateform/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=StoryVerse
```

### API Configuration
The frontend is configured to work with the Django backend running on `http://localhost:8000`. The Vite proxy automatically forwards API requests.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Auth/           # Authentication components
│   │   ├── Layout/         # Layout components (Header, Footer)
│   │   ├── Stories/        # Story-related components
│   │   └── UI/             # Generic UI components
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── pages/              # Page components
│   ├── services/           # API services and utilities
│   └── utils/              # Helper functions
├── public/                 # Static assets
└── config files           # Vite, Tailwind, etc.
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Purple gradient (#d946ef to #c026d3)
- **Background**: Dark theme (#111827, #1f2937)
- **Text**: Light grays (#f9fafb, #e5e7eb, #9ca3af)

### Components
- **Cards**: Glass morphism with subtle borders
- **Buttons**: Gradient primary, outlined secondary
- **Forms**: Dark inputs with focus states
- **Animations**: Smooth hover and transition effects

## 🔗 API Integration

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Secure route protection

### Story Management
- CRUD operations for stories
- File upload for cover images
- Real-time updates with React Query

### Social Features
- Like/unlike stories
- Follow/unfollow users
- Share on social platforms

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Deployment

### Development
```bash
npm run dev
```
Runs on `http://localhost:3000`

### Production Build
```bash
npm run build
npm run preview
```

### Environment Setup
Ensure the Django backend is running on `http://localhost:8000` for full functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Advanced story analytics
- [ ] Mobile app development
- [ ] AI-powered story suggestions
- [ ] Collaborative writing features

---

Built with ❤️ for storytellers and readers worldwide.
