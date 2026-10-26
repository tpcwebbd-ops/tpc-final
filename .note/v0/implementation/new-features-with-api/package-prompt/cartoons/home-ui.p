------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
Context:
I am building an eCommerce application for my company, Amar Cart, using Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion. 
Amar Cart is a trusted online shopping platform offering over 1000 high-quality products, including digital goods, physical products, watches, and clothing.

Provided Files:
1. Mongoose Schema: `api/cartoons/model.ts` (Includes Name, Roll, projectInfo, primeImage, allImages).
2. RTK Query Slice: `redux/cartoonsSlice.ts` (Includes `useGetExamplesQuery`).
3. Expected API Response: `{ data: { examples: [], total: 0, page: 1, limit: 10 }, message: string, status: number }`.

cartoons/model.ts
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

redux/features/cartoons/cartoonsSlice.ts
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

------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
and here is example of response
```
{
    "data": {
        "cartoons": [],
        "total": 0,
        "page": 1,
        "limit": 10
    },
    "message": "Fetched successfully",
    "status": 200
}
```


Task:
Build the `app/page.tsx` home page component. 

Requirements:
1. Make it a visually stunning, premium, and modern eCommerce homepage.
2. Ensure it is fully responsive (mobile, tablet, laptop, desktop).
3. Use Tailwind CSS for styling and Framer Motion for smooth scroll and hover animations.
4. Do NOT include menu and footer section.
5. Create exactly 7-8 sections tailored to the topic of [Insert Topic Here]. Make sure all divs/sections feature eye-catching animations, modern UI, and visually appealing design. Follow this order based on the topic:
    - Hero Banner: Animated background/text with a strong, topic-specific Call to Action (CTA).
    - Explore by Category/Services: Interactive card layouts with relevant icons.
    - Popular/Trending Items: Showcase top content (e.g., top courses, best services, trending games) using topic-specific mock data.
    - Highlight/Promotional Banner: Full-width animated advertisement or special announcement.
    - Featured Content/Top Picks: A beautifully designed grid layout relevant to the topic.
    - Why Choose Us: Feature highlights with animated icons and short descriptions.
    - Customer Testimonials: Engaging slider or grid showing client/user feedback.
    - Final CTA/Newsletter (Optional): A stylish section for subscription or final action.
6. Integrate TypeScript strictly. Define interfaces for the products based on the provided schema.
7. Do not include any comments in the generated codebase.
8. Also make error Handling with good looking UI.







