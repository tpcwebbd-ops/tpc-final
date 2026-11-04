# Course exams

## Course staff

1. Open **Courses → course editor → Learning content**. Add documents, videos, and MCQ questions. Questions default to 1 mark; positive weights up to 100 with two decimal places are supported.
2. Open **MCQ exams**, add an exam title, and select its questions. An exam contains 1–200 questions. Click **Keep exam**, then **Save course** to publish the course changes.
3. Approve student enrollment from **Requests**, or enroll an existing student directly.
4. Open **Exam results & requests** to see student identities, exam timestamps, elapsed time, marks, and per-course allowances. A pending allowance request can be declined or approved for exactly 20 additional attempts. Results also appear in the course View modal, which shows every MCQ, option, correct answer, explanation, and mark value.

## Students

1. Request enrollment in **My Courses**. An approved student can open the course's documents, videos, and exams.
2. Starting an exam reserves one attempt. An unfinished attempt can be resumed without using another credit. Answers are retained in that browser's local storage when available; grading and final results are stored on the server.
3. Submit final answers to see marks and correct answers. Open any saved result to review it again or download the PDF marksheet. The marksheet includes the student's answers, correct answers, per-question marks, total marks, and elapsed time. Bengali text is rendered through the browser's fonts.
4. Each student starts with **20 exam attempts per course**, including retakes. After all available attempts are submitted, request 20 more from the course workspace. Refresh after staff approval to see the new allowance.

## Persistence and access

- `courses` contains the question bank and named exam definitions. Existing courses without exam definitions receive a legacy exam containing their MCQs. Existing questions without a mark value use 1 mark.
- `course_exam_accounts` stores an independent allowance for each student and course. Reservations and allowance approvals use atomic conditional updates, preventing concurrent starts or duplicate reviews from adding credits.
- `course_exam_attempts` stores immutable question snapshots and server-calculated results. Changing course questions does not alter an existing attempt's questions or marks.
- Student APIs require approved enrollment and always derive identity from the authenticated session. Questions returned before submission exclude answer keys and explanations. Staff APIs use the existing course-management permissions.
- Elapsed time is the server-measured time from starting to submitting, including time spent away from the exam. There is no exam time limit.
- Supporting indexes are created automatically when the exam functionality is first accessed.

## Checks

```sh
npm run test:course-exams
npm run test:dashboard-authorization
npm run build
```

The regression scripts use isolated in-memory collections and do not write to the application database.
