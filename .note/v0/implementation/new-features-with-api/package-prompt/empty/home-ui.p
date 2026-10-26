Context:
I am building an eCommerce application for my company, Amar Cart, using Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion. 
Amar Cart is a trusted online shopping platform offering over 1000 high-quality products, including digital goods, physical products, watches, and clothing.

Provided Files:
1. Mongoose Schema: `api/cartoons/model.ts` (Includes Name, Roll, projectInfo, primeImage, allImages).
2. RTK Query Slice: `redux/cartoonsSlice.ts` (Includes `useGetExamplesQuery`).
3. Expected API Response: `{ data: { examples: [], total: 0, page: 1, limit: 10 }, message: string, status: number }`.

cartoons/model.ts
```

```

redux/features/cartoons/cartoonsSlice.ts
```

```

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







