# Plan: Add Shadcn/UI Chart Components

This plan outlines the steps to add various `recharts`-based chart components using `shadcn/ui` to the project and integrate them into the style guide page.

## Phase 1: Setup Base Chart Components

1.  **Add Base Chart Components:** Execute the command `npx shadcn-ui@latest add chart`. This will install the necessary base chart components from `shadcn/ui`, creating `components/ui/chart.tsx` and potentially updating configurations.
2.  **Verify Base Components:** Confirm that `components/ui/chart.tsx` has been successfully created.

## Phase 2: Create Example Chart Components

1.  **Create Directory:** Create a new directory `components/charts/` to keep the chart examples organized.
2.  **Create Files:** Create the following 9 `.tsx` files inside `components/charts/`:
    *   `bar-chart-multiple.tsx`
    *   `pie-chart-donut-text.tsx`
    *   `area-chart-stacked.tsx`
    *   `area-chart-simple.tsx`
    *   `bar-chart-simple.tsx`
    *   `bar-chart-custom-label.tsx`
    *   `bar-chart-interactive.tsx`
    *   `radial-chart-stacked.tsx`
    *   `tooltip-custom-label.tsx`
3.  **Populate Files:** Populate each file with the corresponding code snippet provided by the user.
4.  **Adjust Import Paths:** Modify the import paths within each of these new files to use the project's path aliases (likely `@/components/ui/card` and `@/components/ui/chart`).

## Phase 3: Integrate into Style Guide Page

1.  **Read Style Guide Page:** Examine the contents of `app/(dashboard)/style-guide/page.tsx` to understand its current structure.
2.  **Modify Style Guide Page:** Edit `app/(dashboard)/style-guide/page.tsx` to:
    *   Import the 9 newly created chart components from `@/components/charts/...`.
    *   Add sections within the page's JSX to render each chart component, perhaps under a new "Charts" heading.

## Phase 4: Final Steps

1.  **Review Plan:** User reviews this finalized plan.
2.  **Save Plan (Optional):** Ask if the user would like this plan written to a Markdown file. (Completed)
3.  **Switch Mode:** Request to switch to "Code" mode to implement the plan.

## Plan Visualization

```mermaid
graph TD
    A[Start] --> B[Run 'npx shadcn-ui@latest add chart'];
    B --> C[Verify components/ui/chart.tsx created];
    C --> D[Create components/charts/ directory];
    D --> E[Create 9 Example Chart Files in components/charts/];
    E --> F[Populate Files with Provided Code];
    F --> G[Adjust Import Paths in new files];
    G --> H[Read app/(dashboard)/style-guide/page.tsx];
    H --> I[Modify Style Guide Page: Add Imports & Render Components];
    I --> J[Review Plan with User];
    J -- Approved --> K{Save Plan to MD?};
    K -- Yes --> L[Write Plan to MD File];
    K -- No --> M[Request Switch to 'Code' Mode];
    L --> M;
    M --> N[End Planning];