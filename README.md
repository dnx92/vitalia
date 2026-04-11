# Vitalia - Medical Services Marketplace

![Vitalia Logo](https://img.shields.io/badge/Vitalia-Healthcare%20Without%20Borders-teal?style=for-the-badge)

> **Your health, without borders.** A marketplace connecting patients with verified medical professionals worldwide.

## Features

- 🔍 **Service Search** - Find medical professionals by specialty, location, and availability
- ✅ **Verified Professionals** - Document verification system for medical credentials
- 💳 **Secure Wallet** - Escrow-based payment system
- 📅 **Easy Scheduling** - Real-time booking with calendar integration
- 📊 **Health Tracking** - Monitor vital metrics with custom alerts
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dnx92/vitalia.git
cd vitalia

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── search/           # Service search
│   └── service/          # Service detail
├── components/
│   ├── ui/              # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utilities
├── store/                # Zustand stores
└── types/                # TypeScript types
```

## How to Use

### For Patients

1. **Sign Up** - Create an account at `/auth/register`
2. **Search** - Find doctors at `/search`
3. **Book** - Select a service and book an appointment
4. **Pay** - Add funds to wallet (demo mode)
5. **Track** - Monitor health metrics at `/dashboard/health`

### For Professionals

1. **Register** - Sign up as professional at `/auth/register?role=professional`
2. **Upload Documents** - Submit medical credentials
3. **Create Services** - Add your services and pricing
4. **Manage Calendar** - Set availability
5. **Receive Payments** - Get paid through the wallet system

## Demo Credentials

The app currently uses mock data. To test the full flow:

```bash
# Login with demo user
Email: demo@vitalia.com
Password: demo123
```

## Pages

| Page                | Description              |
| ------------------- | ------------------------ |
| `/`                 | Landing page             |
| `/auth/login`       | User login               |
| `/auth/register`    | User registration        |
| `/search`           | Find medical services    |
| `/service/[id]`     | Service detail & booking |
| `/dashboard`        | User dashboard           |
| `/dashboard/wallet` | Wallet management        |
| `/dashboard/health` | Health metrics tracking  |

## Next Steps for Production

- [ ] Add Prisma + PostgreSQL for data persistence
- [ ] Implement NextAuth with real providers
- [ ] Integrate Stripe for real payments
- [ ] Add WebSocket for real-time notifications
- [ ] Create admin panel
- [ ] Add unit and integration tests

## License

MIT License - feel free to use this template for your projects.

---

Built with ❤️ by [dnx92](https://github.com/dnx92)
