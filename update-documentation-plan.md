# Plan to Update PROJECT_DOCUMENTATION.md

This plan outlines the steps to update `PROJECT_DOCUMENTATION.md` to reflect recent changes, including database schema modifications and the addition of a new user management feature.

## 1. Update Model List (Section 4)

*   Replace the list of models under the "Database Schema" heading (around line 95) with the current models found in the `public` schema based on `prisma/schema.prisma`.
*   **Models to Include:**
    *   `Profile`
    *   `Role`
    *   `folhas_obra` (Work/Job Sheets)
    *   `calculo_materiais` (Material Calculations)
    *   `maquinas` (Machines)
    *   `materiais_impressao` (Printing Materials)
    *   `colas` (Glues/Adhesives)
    *   `embalamento` (Packaging)
    *   `fitas_adesivas` (Adhesive Tapes)
    *   `outros` (Other Materials)
    *   `designers` (Add note: `TODO: Confirm if still actively used`)
*   **Models to Omit:** Internal Supabase Auth models (`auth` schema), mapping tables (`*_id_mapping`).

## 2. Update ER Diagram (Section 4)

*   Replace the existing Mermaid diagram (lines 99-133) with a new diagram reflecting the current `public` schema models and their primary relationships.

```mermaid
erDiagram
    USER ||--o{ PROFILE : has
    PROFILE ||--|| ROLE : has
    PROFILE ||--|| USER : belongs_to
    PROFILE ||--o{ folhas_obra : "assigns (assignedProfile)"
    ROLE ||--o{ PROFILE : assigned_to

    folhas_obra ||--|| PROFILE : "assigned_to (assignedProfile)"

    calculo_materiais ||--o| maquinas : uses
    calculo_materiais ||--o| materiais_impressao : "uses (material1)"
    calculo_materiais ||--o| materiais_impressao : "uses (material2)"
    calculo_materiais ||--o| materiais_impressao : "uses (material3)"

    maquinas ||--o{ calculo_materiais : used_in
    materiais_impressao ||--o{ calculo_materiais : "used_in (material1)"
    materiais_impressao ||--o{ calculo_materiais : "used_in (material2)"
    materiais_impressao ||--o{ calculo_materiais : "used_in (material3)"

    %% Standalone/Less Connected Models (Representing Inventory/Data)
    colas { String id PK; String tipo; String material; }
    designers { String id PK; String nome; String email UK; } %% TODO: Confirm if still relevant
    embalamento { String id PK; String tipo; String material; }
    fitas_adesivas { String id PK; String tipo; String material; }
    outros { String id PK; String tipo; String material; }

    %% Core Models with simplified attributes for clarity
    USER { String id PK; String email UK; }
    PROFILE { String id PK; String userId UK FK; String firstName; String lastName; String roleId FK; }
    ROLE { String id PK; String name UK; }
    folhas_obra { String id PK; Int numero_fo; String assignedProfileId FK; String item; }
    calculo_materiais { String id PK; String calculation_id UK; String maquina_uuid FK; Int material1_id FK; Int material2_id FK; Int material3_id FK; }
    maquinas { String id PK; String maquina; Int integer_id; }
    materiais_impressao { Int id PK; String tipo; String material; }
```

## 3. Update Authentication & Authorization (Section 5)

*   **Section 5.1 (Authentication Flow):**
    *   Add details about the new user creation process via the `/api/users` endpoint.
    *   Mention it handles both Supabase Auth user creation and `profiles` table insertion.
    *   Note the client-side update logic for existing profiles (editing via `app/(dashboard)/users/page.tsx`).
*   **Section 5.2 (Authorization - RBAC):**
    *   Mention the new `/users` page (`app/(dashboard)/users/page.tsx`).
    *   Add a `TODO` comment to confirm the required roles for accessing `/users` and its associated API endpoints (`/api/users`, `/api/users/delete`) within the `middleware.ts` configuration.

## 4. Update API Endpoints (Section 7)

*   Add a new subsection for `/api/users`:
    *   **Method:** `POST`
    *   **Functionality:** Creates a new Supabase Auth user and inserts a corresponding record into the `profiles` table.
    *   **Authorization:** Requires appropriate permissions (`TODO: Verify required role, likely Admin`).
*   Add a new subsection for `/api/users/delete`:
    *   **Method:** `POST` (based on client code usage)
    *   **Functionality:** Deletes a Supabase Auth user (and potentially associated profile via cascade or trigger - `TODO: Verify cascade behavior`). Takes `authUserId` in the request body.
    *   **Authorization:** Requires appropriate permissions (`TODO: Verify required role, likely Admin`).

## 5. Update Key Components (Section 8)

*   Add a bullet point for `app/(dashboard)/users/page.tsx`: Describe it as the primary component for user administration (viewing, adding, editing profiles, deleting users).

## 6. Update Core Modules (Section 6)

*   Add a new subsection (e.g., `6.x User Management`) for the `app/(dashboard)/users/` route:
    *   **Status:** Implemented
    *   **Purpose:** To manage user accounts, profiles, and roles within the system.
    *   **Current Implementation:** Provides a table view of users (from `users_with_profiles` view), allows adding new users (via `/api/users`), editing profile details (direct DB update), and deleting users (via `/api/users/delete`). Uses a dialog form for adding/editing.
    *   **Relevant Schema:** `Profile`, `Role`, `User` (via view/API).
    *   **API Endpoints:** `/api/users`, `/api/users/delete`.
    *   **Components:** Uses various Shadcn/UI components (`Card`, `Table`, `Dialog`, `Form`, `Input`, `Select`, etc.).
*   Review the existing `Employee Portal` section (`6.5`). Determine if it's now redundant or serves a different purpose compared to the new `/users` page. Add `TODO` comments or update/remove as necessary.

## 7. Review Other Sections

*   Perform a brief review of all other sections in `PROJECT_DOCUMENTATION.md`.
*   Look for any remaining references to the old database models (e.g., `InventoryItem`, `Customer`, `Quote`, `ProductionOrder`) that were removed.
*   Add `TODO` comments where updates might be needed based on the schema and feature changes.

---
*Plan generated on: 2025-04-14*