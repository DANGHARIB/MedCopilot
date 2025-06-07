# MedCopilot 🏥

## Description
MedCopilot is an AI-powered medical school application assistant that helps students navigate the complex process of applying to medical schools. The platform provides essay writing assistance, school selection guidance, and timeline management.

## Features ✨
- **Modern Authentication** - Secure sign-in/sign-up with beautiful UI
- **Essay Writing Assistant** - AI-powered essay generation and editing
- **School Selection** - Comprehensive medical school database and matching
- **Application Timeline** - Track deadlines and manage application progress
- **Profile Management** - Complete student profile and AMCAS integration

## Tech Stack 🛠️
- **Frontend**: React 19, Vite, CSS3
- **Backend**: Node.js, NestJS, Prisma
- **Database**: PostgreSQL
- **Deployment**: Netlify (Frontend)

## Project Structure 📁
```
MedCopilot/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # NestJS API
│   ├── src/
│   ├── prisma/
│   └── package.json
├── package.json       # Root package.json for deployment
└── netlify.toml       # Netlify configuration
```

## Getting Started 🚀

### Prerequisites
- Node.js 22.16.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DANGHARIB/MedCopilot.git
   cd MedCopilot
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies
   npm run install-all
   
   # Or install separately
   npm run install-frontend
   npm run install-backend
   ```

3. **Start development servers**
   ```bash
   # Frontend development server
   npm run dev
   
   # Backend (in backend/ directory)
   cd backend && npm run start:dev
   ```

## Scripts 📝

### Root Level Scripts
- `npm run build` - Build frontend for production
- `npm run dev` - Start frontend development server
- `npm run install-all` - Install all dependencies
- `npm run install-frontend` - Install frontend dependencies
- `npm run install-backend` - Install backend dependencies

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Deployment 🌐

The application is configured for deployment on Netlify:

1. **Automatic Deployment**: Connected to GitHub for automatic deploys
2. **Build Command**: `npm run build`
3. **Publish Directory**: `frontend/dist`
4. **Node Version**: 22.16.0

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact 📧

**DANGHARIB** - GitHub: [@DANGHARIB](https://github.com/DANGHARIB)

Project Link: [https://github.com/DANGHARIB/MedCopilot](https://github.com/DANGHARIB/MedCopilot) 