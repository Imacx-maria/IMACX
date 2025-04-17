import React from 'react';

// TODO: Fetch data needed for metrics (Profiles with 'Designers' role, FolhaObra)
// import { prisma } from '@/lib/db/prisma';
// import MetricsClientComponent from './components/metrics-client'; // To be created

// async function getMetricsData() {
//   // Fetch relevant data from FolhaObra and Profile tables
//   // const jobs = await prisma.folhaObra.findMany({...});
//   // const designers = await prisma.profile.findMany({...}); // Filtered by role
//   // return { jobs, designers };
//   return { jobs: [], designers: [] }; // Placeholder
// }

export default async function DesignerFlowMetricsPage() {
  // const { jobs, designers } = await getMetricsData();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Designer Flow - Metrics Dashboard</h1>
      {/*
        Placeholder for the client component that will contain:
        - Filter Controls (Year/Month)
        - Summary Cards
        - Charts (Recharts)
        - Top FO Tables
      */}
      <p className="text-muted-foreground">
        Module content (Metrics Filters, Charts, Tables, etc.) will be implemented here using client components.
      </p>
      {/* <MetricsClientComponent jobs={jobs} designers={designers} /> */}
    </div>
  );
}