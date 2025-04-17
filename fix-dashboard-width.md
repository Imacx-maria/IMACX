# Plan: Fix Dashboard Content Width Constraint

**Date:** 2025-04-10

## 1. Problem Identification

The content area within the dashboard pages (e.g., Style Guide, Settings, Price Structure) does not expand to fill the available horizontal space on wider screens. Screenshots confirm that the content remains centered within a fixed maximum width.

## 2. Root Cause Analysis

Analysis of the dashboard layout file (`app/(dashboard)/layout.tsx`) revealed the following structure:

```typescript
// app/(dashboard)/layout.tsx
// ...
<main className="flex-1 p-12">
  {/* Centering wrapper with glow */}
  {/* This div applies the width constraint */}
  <div className="relative isolate max-w-7xl mx-auto background-glow">
    {/* ... SidebarTrigger ... */}
    {children} {/* Page content is rendered here */}
  </div>
</main>
// ...
```

The `div` element directly wrapping the `{children}` inside the `<main>` tag includes the Tailwind CSS classes `max-w-7xl` (setting a maximum width) and `mx-auto` (centering the element horizontally). This container limits the width of all rendered page content.

## 3. Proposed Solution

Modify the `app/(dashboard)/layout.tsx` file:

*   **Target:** The `div` element located around line 41, inside the `<main>` element.
*   **Action:** Remove the `max-w-7xl` and `mx-auto` classes from this `div`.

**Diff:**

```diff
--- a/app/(dashboard)/layout.tsx
+++ b/app/(dashboard)/layout.tsx
@@ -38,7 +38,7 @@
        </div>
        <main className="flex-1 p-12"> {/* Removed bg-transparent */}
          {/* Centering wrapper with glow */}
-         <div className="relative isolate max-w-7xl mx-auto background-glow">
+         <div className="relative isolate background-glow"> {/* Removed max-w-7xl and mx-auto */}
            <div className="flex items-center mb-4">
              <SidebarTrigger className="mr-2" />
            </div>

```

This change will allow the content container to inherit the full width available within the `<main>` element (respecting its padding `p-12`).

## 4. Verification

After applying the code change:

1.  Ensure the development server (`npm run dev`) reflects the changes.
2.  Open the application in a browser and resize the window to a wide dimension.
3.  Navigate to various dashboard pages (e.g., Settings, Price Structure).
4.  Confirm that the main content area now expands horizontally to fill the available space, leaving only the padding defined by the `<main>` element.