/*
|-----------------------------------------
| setting up courses.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 28 October, 2026
|-----------------------------------------
*/

import "server-only";

import { type ObjectId } from "mongodb";

import { type CourseContent, type CourseEnrollmentRequest, type CourseStudent } from "@/lib/dashboard/courses";
import { database } from "@/lib/db";

export type CourseDocument = {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  duration: string;
  totalClasses: number;
  time: string;
  studentsList: CourseStudent[];
  enrollmentRequests?: CourseEnrollmentRequest[];
  content: CourseContent[];
  createdAt: Date;
  updatedAt: Date;
};

export const coursesCollection = () => database().collection<CourseDocument>("courses");
