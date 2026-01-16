# HR Leave Management System

A comprehensive full-stack HR leave management demo application built with Next.js 14+, TypeScript, and Tailwind CSS. This application provides both employee and admin portals for managing leave requests, tracking balances, and viewing analytics.

## Features

### Employee Portal
- **Dashboard**: View current leave balance, upcoming leave, and quick actions
- **Leave Submission**: Submit leave requests with date range picker, leave type selection, and duration options (Full Day/Half Day)
- **Leave Calendar**: Visual calendar view with color-coded leave types
- **Leave History**: Filterable and sortable table of all leave requests with pagination

### Admin Portal
- **Employee Management**: View all employees with balance overview, sorting, and search functionality
- **Approval Queue**: Review and approve/reject pending leave requests
- **Analytics Dashboard**: 
  - Utilization rate charts
  - Leave type breakdown (pie chart)
  - Monthly trends (line chart)
  - Grade comparison (bar chart)
- **CSV Export**: Download all leave data as CSV

### Core Functionality
- **Leave Entitlement Calculation**: Automatically calculates annual leave based on:
  - Employee grade (Junior/Mid/Senior/Executive)
  - Years of service (auto-calculated from first day of work)
  - Service brackets: 0-2 years (base), 3-5 years (+2), 6-10 years (+4), 11+ years (+6)
- **Balance Tracking**: Real-time balance calculation preventing over-booking
- **Leave Types**: 
  - Annual Leave (counts against balance): Vacation, Personal
  - Non-Annual Leave (tracked separately): Sick Leave, Bereavement, Medical, Parental
- **Validation**: Prevents overlapping approved leaves and insufficient balance submissions

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: lucide-react

## Project Structure

```
HR Tool/
├── app/                    # Next.js App Router pages
│   ├── employee/          # Employee portal pages
│   └── admin/              # Admin portal pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── employee/          # Employee-specific components
│   └── admin/             # Admin-specific components
├── lib/                   # Utilities and business logic
│   ├── types.ts          # TypeScript interfaces
│   ├── mockData.ts       # Mock employee and leave data
│   ├── calculations.ts   # Leave entitlement calculations
│   ├── dateUtils.ts      # Date manipulation helpers
│   └── csvExport.ts      # CSV generation utility
└── hooks/
    └── useLeaveManagement.tsx  # State management hook
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "HR Tool"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Usage

### Employee Portal
1. Navigate to `/employee` to view your dashboard
2. Click "Submit Leave Request" to submit a new leave
3. View your leave calendar at `/employee/calendar`
4. Check your leave history at `/employee/history`

### Admin Portal
1. Navigate to `/admin` for the admin dashboard
2. View all employees at `/admin/employees`
3. Approve/reject leave requests at `/admin/approvals`
4. View analytics at `/admin/analytics`
5. Export data using the CSV export button in analytics

## Mock Data

The application includes comprehensive mock data:
- **25 employees** with diverse profiles (grades, start dates spanning 2010-2024)
- **120+ leave records** with realistic patterns (more leave in summer and December)
- Mix of approved, pending, and rejected statuses
- Various leave types and durations

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings

3. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

### Environment Variables

No environment variables are required for this demo application as it uses mock data stored in TypeScript constants.

### Build Configuration

Vercel will automatically:
- Detect Next.js framework
- Run `npm run build`
- Optimize the build
- Deploy to edge network

## Key Implementation Details

### Leave Entitlement Calculation

The system calculates annual leave entitlement based on:
- **Base entitlement** by grade (0-2 years):
  - Junior: 15 days
  - Mid: 18 days
  - Senior: 20 days
  - Executive: 25 days
- **Bonus days** by years of service:
  - 3-5 years: +2 days
  - 6-10 years: +4 days
  - 11+ years: +6 days

Example: A Mid-grade employee with 4 years of service gets 18 (base) + 2 (bonus) = 20 days.

### Balance Tracking

- Annual leave deducts from balance when approved
- Full Day = 1 day, Half Day = 0.5 days
- Non-annual leave is tracked separately with no balance limit
- Real-time validation prevents over-booking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile Responsiveness

The application is fully responsive with mobile-first design:
- Touch-friendly UI elements (min 44x44px)
- Stacked layouts on mobile, side-by-side on desktop
- Responsive tables with horizontal scroll on mobile
- Optimized breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## License

This is a demo project for educational purposes.

## Notes

- This is a **demo application** with mock data - no database or authentication is implemented
- All data is stored in client-side state and will reset on page refresh
- For production use, integrate with a backend API and database
- Add authentication and authorization for real-world deployment
