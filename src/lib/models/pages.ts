import "server-only";

import type { Document } from "mongodb";
import type { SitePage } from "@/redux/features/dashboard/pages/pagesSlice";
import { database } from "@/lib/db";

export const pagesCollection = () => database().collection<SitePage>("pages");
export const pageSubmissionsCollection = <T extends Document>() => database().collection<T>("page-submissions");
