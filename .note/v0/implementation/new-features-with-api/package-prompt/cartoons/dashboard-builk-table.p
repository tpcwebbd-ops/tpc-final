------------------------------------------------------------------------------------
------------------------------------------------------------------------------------
Look at the dashboard/examples/page.tsx
```
const Page = () => {
  return <main>Page</main>;
};
export default Page;
```


api/cartoons/model.ts
```
import mongoose, { Schema } from 'mongoose';

const cartoonSchema = new Schema(
  {
    title: { type: String },
    email: {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    'author-email': {
      type: String,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: { type: String, select: false },
    passcode: { type: String, select: false },
    area: { type: String, enum: ['Bangladesh', 'India', 'Pakistan', 'Canada'] },
    'sub-area': [{ type: String }],
    'products-images': [{ url: { type: String }, name: { type: String } }],
    'personal-image': { url: { type: String }, name: { type: String } },
    description: { type: String, trim: true },
    age: { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    amount: { type: Number },
    isActive: { type: Boolean, default: false },
    'start-date': { type: Date, default: Date.now },
    'start-time': { type: String },
    'schedule-date': { start: { type: Date }, end: { type: Date } },
    'schedule-time': { start: { type: String }, end: { type: String } },
    'favorite-color': { type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code'] },
    number: { type: String },
    profile: { type: String, trim: true },
    test: { type: String },
    info: { type: String },
    shift: [{ type: String }],
    policy: { type: Boolean, default: false },
    hobbies: [{ type: String }],
    ideas: { type: [String], enum: ['O 1', 'O 2', 'O 3', 'O 4'] },
    students: [
      {
        Name: { type: String },
        Class: { type: String },
        Roll: { type: String },
      },
    ],
    complexValue: {
      id: { type: String },
      title: { type: String },
      parent: {
        id: { type: String },
        title: { type: String },
        child: {
          id: { type: String },
          title: { type: String },
          child: { type: String },
          note: { type: String },
        },
        note: { type: String },
      },
      note: { type: String },
    },
  },
  { timestamps: true },
);

export default mongoose.models.Cartoon || mongoose.model('Cartoon', cartoonSchema);

```

redux/cartoonsSlice.ts
``` 
// This file is use for rest api
import { apiSlice } from '@/redux/api/apiSlice';

// Use absolute paths with leading slash to ensure consistent behavior
export const cartoonsApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCartoons: builder.query({
      query: ({ page, limit, q }) => {
        let url = `/api/cartoons/v1?page=${page || 1}&limit=${limit || 10}`;
        if (q) {
          url += `&q=${encodeURIComponent(q)}`;
        }
        return url;
      },
      providesTags: [{ type: 'tagTypeCartoons', id: 'LIST' }],
    }),
    getCartoonsById: builder.query({
      query: id => `/api/cartoons/v1?id=${id}`,
    }),
    addCartoons: builder.mutation({
      query: newCartoon => ({
        url: '/api/cartoons/v1?',
        method: 'POST',
        body: newCartoon,
      }),
      invalidatesTags: [{ type: 'tagTypeCartoons' }],
    }),
    updateCartoons: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/cartoons/v1?`,
        method: 'PUT',
        body: { id: id, ...data },
      }),
      invalidatesTags: [{ type: 'tagTypeCartoons' }],
    }),
    deleteCartoons: builder.mutation({
      query: ({ id }) => ({
        url: `/api/cartoons/v1?`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: [{ type: 'tagTypeCartoons' }],
    }),
    bulkUpdateCartoons: builder.mutation({
      query: bulkData => ({
        url: `/api/cartoons/v1?bulk=true`,
        method: 'PUT',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCartoons' }],
    }),
    bulkDeleteCartoons: builder.mutation({
      query: bulkData => ({
        url: `/api/cartoons/v1?bulk=true`,
        method: 'DELETE',
        body: bulkData,
      }),
      invalidatesTags: [{ type: 'tagTypeCartoons' }],
    }),
  }),
});

export const {
  useGetCartoonsQuery,
  useAddCartoonsMutation,
  useUpdateCartoonsMutation,
  useDeleteCartoonsMutation,
  useBulkUpdateCartoonsMutation,
  useBulkDeleteCartoonsMutation,
  useGetCartoonsByIdQuery,
} = cartoonsApi;

```

------------------------------------------------------------------------------------
------------------------------------------------------------------------------------

and here is example of response
```
{
    "data": {
        "examples": [],
        "total": 0,
        "page": 1,
        "limit": 10
    },
    "message": "Fetched successfully",
    "status": 200
}
```

Now your task is to update `dashboard/examples/page.tsx` with the following requirements:

1. 🔘 Add Button & Modal (Top Right)
   - Place a visually appealing **"Add Order"** button at the top-right corner.
   - On click, open a **modern modal (centered, responsive)** with:
     - Smooth **fade + scale animation** on open/close.
     - A **close (✕) icon** at the top-right.
   - Inside the modal:
     - Dynamically generate **all fields from the model**.
     - Handle media inputs:
       - Single image → `ImageUploadManagerSingle`
       - Multiple images → `ImageUploadManager`
       - Single video → `VideoUploadImageManagerSingle`
       - Multiple videos → `VideoUploadImageManager`
     - Bottom aligned **"Add" button** with loading state.
   - Ensure:
     - Proper **form validation**
     - Clear **error messages**
     - **Responsive layout** (stack fields on mobile, grid on desktop)

2. 📊 Summary Section (Filterable Cards)
   - Create a **summary dashboard section** with 3 cards:
     - Last Month (30 days)
     - Last Week (7 days)
     - Total (Lifetime)
   - Each card:
     - Displays **total sales/examples**
     - Has **hover animation (scale + shadow)**
     - Is **clickable to filter data**
   - Use a clean **card layout with icons and color distinction**
   - Make it **responsive (grid → stacked on mobile)**

3. 🔍 Smart Search Bar
   - Add a **debounced search input**:
     - Trigger API call after **3 characters**
     - Add **300ms–500ms debounce**
     - Avoid duplicate fetch if input hasn’t changed
   - Include:
     - Search icon inside input
     - Loading indicator while fetching

4. 📋 Table Section (Advanced Data Table)
   - Build a **fully responsive data table** with:
     - Horizontal scroll on mobile
     - Sticky header (optional)
   - Features:
     - Column visibility toggle (show/hide columns)
     - Export options (CSV, Excel)
     - Bulk select (checkbox per row + select all)
     - Bulk actions: (open a modal for confirmation)
       - Delete
       - Update
     - Row actions:
       - Edit
       - Delete
       - View (optional modal/drawer)
   - Pagination:
     - Bottom aligned
     - Select items per page (10–500)
     - Smooth transition when changing pages

5. ⚙️ State Management (Redux Toolkit)
   - Use **Redux Toolkit Query (RTK Query)**:
     - Queries for fetching data
     - Mutations for add, update, delete
   - Ensure:
     - Proper cache invalidation
     - Optimistic updates (optional but preferred)

6. 🚦 UX States Handling
   - Loading:
     - Use skeleton loaders or spinners
   - Error:
     - Show user-friendly error messages
   - Empty State:
     - Display:
       👉 “No data found in database”
       - Add illustration or icon for better UX

7. 🎨 UI/UX & Design Guidelines
- Use my existing stack and style system:
  - Tailwind CSS
  - ShadCN UI
  - Framer Motion
  - Lucide React icons

- Follow a modern dark glassmorphism dashboard design:
  - Backdrop blur panels
  - Semi-transparent dark surfaces
  - Thin soft borders
  - Strong but clean shadows
  - Rounded-sm corners
  - Compact, premium layout

- Color palette:
  - Primary: Indigo / Blue glow
  - Accent: Red / Rose / Emerald based on action priority
  - Background: dark transparent / soft gradient layers
  - Text: White with opacity-based hierarchy

- Typography:
  - Bold, eye-catching page titles
  - Small uppercase tracking labels for metadata
  - Clear visual hierarchy for title, subtitle, body, and controls

- Animations:
  - Page load → fade in + slight upward motion
  - Buttons → smooth hover transition + subtle scale
  - Modal → fade + zoom
  - Cards → hover lift + border highlight + media zoom
  - Empty/loading states → elegant animated feedback
  - Grid items → staggered entrance animation

- Layout:
  - Fully responsive for mobile, tablet, and desktop
  - Use grid/flex intelligently
  - Maintain consistent spacing, alignment, and interaction patterns

- UX:
  - Include polished loading, empty, and error states
  - Use dialogs for details/preview/confirmation
  - Keep interface visually rich but easy to use

8. 📱 Full Responsiveness
   - Mobile:
     - Stack layouts vertically
     - Scrollable table
   - Tablet:
     - 2-column grids where possible
   - Desktop/Laptop:
     - Full grid layout with proper spacing

9. 🧩 Code Quality
   - Keep components reusable:
     - Modal component
     - Table component
     - Form components
   - Use clean folder structure
   - Maintain readability and separation of concerns