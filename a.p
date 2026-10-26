Lool at the page '/dashboard/profile' 
I want a new plage for all user like profile and the new page will be '/dashboard/tutorial' 

I want tutorial page as the following instructions. 
- only render text and video content form Youtube. 
- here is tutorial.json file example. and Your task is render the page based on the following data. 
```
{
    "tutorialData":  [
                         {
                             "tag":  "Instructions",
                             "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                         },
                         {
                             "tag":  "Developer",
                             "sidebar_url":  "/dashboard/developer",
                             "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A",
                             "children":  [
                                              {
                                                  "tag":  "Users",
                                                  "sidebar_url":  "/dashboard/developer/users",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Account",
                                                  "sidebar_url":  "/dashboard/developer/account",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Session",
                                                  "sidebar_url":  "/dashboard/developer/session",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Verification",
                                                  "sidebar_url":  "/dashboard/developer/verification",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Sidebar",
                                                  "sidebar_url":  "/dashboard/developer/sidebar",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Navigation",
                                                  "sidebar_url":  "/dashboard/developer/navigation",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              }
                                          ]
                         },
                         {
                             "tag":  "Admin",
                             "sidebar_url":  "/dashboard/admin",
                             "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A",
                             "children":  [
                                              {
                                                  "tag":  "Access",
                                                  "sidebar_url":  "/dashboard/admin/access",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Users",
                                                  "sidebar_url":  "/dashboard/admin/users",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Role",
                                                  "sidebar_url":  "/dashboard/admin/role",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Footer",
                                                  "sidebar_url":  "/dashboard/admin/footer",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Menu",
                                                  "sidebar_url":  "/dashboard/admin/menu",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Pages",
                                                  "sidebar_url":  "/dashboard/admin/pages",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "SEO Settings",
                                                  "sidebar_url":  "/dashboard/admin/seo",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Top Banner",
                                                  "sidebar_url":  "/dashboard/admin/topbanner",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Build",
                                                  "sidebar_url":  "/dashboard/admin/build",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Tracking",
                                                  "sidebar_url":  "/dashboard/admin/tracking",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "WhatsApp",
                                                  "sidebar_url":  "/dashboard/admin/whatsapp",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              }
                                          ]
                         },
                         {
                             "tag":  "Leads",
                             "sidebar_url":  "/dashboard/leads",
                             "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A",
                             "children":  [
                                              {
                                                  "tag":  "Overview",
                                                  "sidebar_url":  "/dashboard/leads/overview",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Funnels",
                                                  "sidebar_url":  "/dashboard/leads/funnels",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Customers",
                                                  "sidebar_url":  "/dashboard/leads/customers",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "Councilors",
                                                  "sidebar_url":  "/dashboard/leads/councilors",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              },
                                              {
                                                  "tag":  "My Leads",
                                                  "sidebar_url":  "/dashboard/leads/my-leads",
                                                  "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                                              }
                                          ]
                         },
                         {
                             "tag":  "Media",
                             "sidebar_url":  "/dashboard/media",
                             "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                         },
                         {
                             "tag":  "Profile",
                             "sidebar_url":  "/dashboard/profile",
                             "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                         },
                         {
                             "tag":  "Category",
                             "sidebar_url":  "/dashboard/category",
                             "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                         },
                         {
                             "tag":  "Coupons",
                             "sidebar_url":  "/dashboard/coupon",
                             "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                         },
                         {
                             "tag":  "Install",
                             "sidebar_url":  "/dashboard/install",
                             "yt_url":  "https://www.youtube.com/watch?v=TSuw8z_027A"
                         }
                     ]
}

```
At the left side I want to see the tag and make scroll active tag, so user can see which tag is showen. and render youtube video based on active or click tag. make the page with eye-catching view and stunning animation. make sure the page is Looks Good. please use rounded-sm and please use our theme color. 