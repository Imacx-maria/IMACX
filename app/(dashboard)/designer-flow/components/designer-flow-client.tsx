'use client';

import React, { useState } from 'react';
// TODO: Import necessary types from Prisma (e.g., FolhaObra, Profile)
// import { FolhaObra, Profile } from '@prisma/client'; // Adjust if your client path is different

// TODO: Import Shadcn UI components (Button, Table, Dialog, Input, Select, Checkbox, Switch etc.)
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// TODO: Import sub-components like HeaderControls, JobTable, NewJobDialog once created

// Define props based on data fetched in the Server Component (page.tsx)
// interface DesignerFlowClientProps {
//   initialJobs: (FolhaObra & { assignedProfile: Profile | null })[]; // Example type
//   designerProfiles: Profile[]; // Example type
// }

// Using any for now until types are properly imported/defined
interface DesignerFlowClientProps {
  initialJobs: any[];
  designerProfiles: any[];
}


export default function DesignerFlowClientComponent({ initialJobs, designerProfiles }: DesignerFlowClientProps) {
  // --- State Management ---
  const [jobs, setJobs] = useState(initialJobs);
  const [designers] = useState(designerProfiles); // Designers list likely won't change often here

  // Filters State
  const [filterOpen, setFilterOpen] = useState(true);
  const [filterFO, setFilterFO] = useState('');
  const [filterItem, setFilterItem] = useState('');

  // Modal State
  const [isNewJobDialogOpen, setIsNewJobDialogOpen] = useState(false);

  // Unsaved Changes State (more complex, might need different approach)
  const [unsavedChanges, setUnsavedChanges] = useState({}); // Placeholder

  // Loading/Submitting State
  const [isLoading, setIsLoading] = useState(false);

  // --- Event Handlers ---
  const handleRefresh = () => {
    console.log('TODO: Refresh data');
    // Likely involves calling a server action or re-fetching via router.refresh() or client-side library
  };

  const handleSaveChanges = () => {
    console.log('TODO: Save changes', unsavedChanges);
    // Likely involves calling a server action with unsavedChanges payload
  };

  const handleAddJob = (newJobData: any) => {
    console.log('TODO: Handle adding job - likely done via Server Action called from Dialog');
    setIsNewJobDialogOpen(false);
    // Refresh data after successful add
  };

  // --- Filtering Logic ---
  const filteredJobs = React.useMemo(() => {
    return jobs.filter(job => {
      if (filterOpen && job.paginacao) return false; // Assuming 'paginacao' means completed
      if (filterFO && (!job.numero_fo || !job.numero_fo.toString().includes(filterFO))) return false;
      if (filterItem && (!job.item || !job.item.toLowerCase().includes(filterItem.toLowerCase()))) return false;
      return true;
    });
  }, [jobs, filterOpen, filterFO, filterItem]);

  // --- Render Logic ---
  return (
    <div>
      {/* TODO: Implement HeaderControls Component */}
      <div className="mb-4 p-4 border rounded bg-card text-card-foreground">
        <p>Header Controls Placeholder</p>
        {/* Filters (Switch, Input), Buttons (Add, Refresh, Save) go here */}
        <button onClick={() => setIsNewJobDialogOpen(true)} className="p-2 bg-primary text-primary-foreground rounded">Add Job (Opens Dialog)</button>
        <button onClick={handleRefresh} className="ml-2 p-2 bg-secondary text-secondary-foreground rounded">Refresh</button>
        {Object.keys(unsavedChanges).length > 0 && (
           <button onClick={handleSaveChanges} className="ml-2 p-2 bg-destructive text-destructive-foreground rounded">Save Changes</button>
        )}
      </div>

      {/* TODO: Implement JobTable Component */}
      <div className="border rounded">
        <p>Job Table Placeholder</p>
        {/* Pass filteredJobs, designers, setUnsavedChanges etc. to JobTable */}
        <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-60">
            {JSON.stringify(filteredJobs.slice(0, 5), null, 2)}
            {filteredJobs.length > 5 ? '\n...' : ''}
        </pre>
      </div>

      {/* TODO: Implement NewJobDialog Component (using Shadcn Dialog) */}
      {/*
      <Dialog open={isNewJobDialogOpen} onOpenChange={setIsNewJobDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
          </DialogHeader>
          <p>New Job Form Placeholder</p>
          {/* Form using react-hook-form calling a server action on submit */}
      {/*
        </DialogContent>
      </Dialog>
      */}
       {isNewJobDialogOpen && (
         <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center" onClick={() => setIsNewJobDialogOpen(false)}>
            <div className="bg-background p-6 rounded-lg shadow-lg z-50 w-1/2" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4">Add New Job (Dialog Placeholder)</h2>
                <p>Form content goes here...</p>
                <button onClick={() => setIsNewJobDialogOpen(false)} className="mt-4 p-2 bg-secondary text-secondary-foreground rounded">Close</button>
            </div>
         </div>
       )}
    </div>
  );
}