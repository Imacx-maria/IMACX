# IMACX Business Suite

A professional Next.js 14 starter project for an integrated business application suite. This project provides a solid foundation for building enterprise-grade applications with authentication, role-based access control, and a modern UI.

## Features

- **Next.js 14 with App Router**: Modern React framework with server components
- **TypeScript**: Type-safe code for better developer experience
- **shadcn/ui Components**: Beautifully designed UI components
- **Dark/Light Mode**: Theme support with system preference detection
- **Authentication**: Complete authentication system with Supabase Auth
- **Role-Based Access Control**: Admin, Manager, and Staff roles
- **Supabase Integration**: Database and authentication services
- **Prisma ORM**: Type-safe database client
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-friendly layouts
- **API Layer**: Structured API routes with error handling

## Application Sections

- **Dashboard**: Overview of key metrics and quick access to sections
- **Stock Management**: Inventory tracking and management
- **Quoting System**: Create and manage customer quotes
- **Production Management**: Track production processes
- **Analytics Dashboard**: Business intelligence and reporting
- **Employee Portal**: Employee information and resources
- **Components Showcase**: UI component library (Admin only)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/imacx-suite.git
cd imacx-suite
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Copy the `.env.example` file to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database
DATABASE_URL=your-database-url
```

4. Set up the database:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
imacx-suite/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Dashboard and application routes
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── forms/              # Form components
│   ├── ui/                 # UI components (shadcn/ui)
│   └── ...                 # Other component categories
├── lib/                    # Utility functions and services
│   ├── auth/               # Authentication utilities
│   ├── db/                 # Database utilities
│   ├── validations/        # Zod schemas and validation
│   └── ...                 # Other utilities
├── prisma/                 # Prisma ORM
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seed script
├── public/                 # Static assets
└── types/                  # TypeScript type definitions
```

## Authentication

The application uses Supabase Auth for authentication. The following user roles are available:

- **Admin**: Full access to all features
- **Manager**: Access to most features except admin-specific ones
- **Staff**: Limited access based on assigned permissions

Default users (for development):

- Admin: admin@example.com / password
- Manager: manager@example.com / password
- Staff: staff@example.com / password

## Database Schema

The database schema is defined in `prisma/schema.prisma`. The main models are:

- **User**: User account information
- **Profile**: User profile details
- **Role**: User roles and permissions

## Adding New Components

To add new shadcn/ui components:

```bash
npx shadcn-ui@latest add [component-name]
```

For example:

```bash
npx shadcn-ui@latest add button
```

## Styling

The project uses Tailwind CSS for styling. The theme configuration is in `tailwind.config.js`.

To customize the theme, modify the `theme` object in the configuration file.

## API Routes

API routes are located in the `app/api` directory. Each route follows a consistent pattern:

- Request validation using Zod
- Authentication and authorization checks
- Error handling
- Response formatting

## Deployment to Vercel

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://github.com/colinhacks/zod)
