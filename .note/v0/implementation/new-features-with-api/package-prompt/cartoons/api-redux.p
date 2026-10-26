Look at the code 
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

cartoons/controller.ts
```
import { withDB } from '@/app/api/utils/db';
import { FilterQuery } from 'mongoose';

import Cartoon from './model';

import { formatResponse, IResponse } from '@/app/api/utils/utils';

export async function createCartoon(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const cartoonData = await req.json();
      const newCartoon = await Cartoon.create({
        ...cartoonData,
      });
      return formatResponse(newCartoon, 'Cartoon created successfully', 201);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function getCartoonById(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return formatResponse(null, 'Cartoon ID is required', 400);

    const cartoon = await Cartoon.findById(id);
    if (!cartoon) return formatResponse(null, 'Cartoon not found', 404);

    return formatResponse(cartoon, 'Cartoon fetched successfully', 200);
  });
}

export async function getCartoons(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const searchQuery = url.searchParams.get('q');

    let searchFilter: FilterQuery<unknown> = {};

    if (searchQuery) {
      if (searchQuery.startsWith('createdAt:range:')) {
        const datePart = searchQuery.split(':')[2];
        const [startDateString, endDateString] = datePart.split('_');

        if (startDateString && endDateString) {
          const startDate = new Date(startDateString);
          const endDate = new Date(endDateString);
          endDate.setUTCHours(23, 59, 59, 999);

          searchFilter = {
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          };
        }
      } else {
        const orConditions: FilterQuery<unknown>[] = [];

        const stringFields = [
          'title',
          'email',
          'description',
          'number',
          'profile',
          'test',
          'complexValue.id',
          'complexValue.title',
          'complexValue.parent.id',
          'complexValue.parent.title',
          'complexValue.parent.child.id',
          'complexValue.parent.child.title',
          'complexValue.parent.child.child',
          'complexValue.parent.child.note',
          'complexValue.parent.note',
          'complexValue.note',
        ];
        stringFields.forEach(field => {
          orConditions.push({ [field]: { $regex: searchQuery, $options: 'i' } });
        });

        const numericQuery = parseFloat(searchQuery);
        if (!isNaN(numericQuery)) {
          const numberFields: string[] = ['age', 'amount'];
          numberFields.forEach(field => {
            orConditions.push({ [field]: numericQuery });
          });
        }

        if (orConditions.length > 0) {
          searchFilter = { $or: orConditions };
        }
      }
    }

    const cartoons = await Cartoon.find(searchFilter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit);

    const totalCartoons = await Cartoon.countDocuments(searchFilter);

    return formatResponse(
      {
        cartoons: cartoons || [],
        total: totalCartoons,
        page,
        limit,
      },
      'Cartoons fetched successfully',
      200,
    );
  });
}

export async function updateCartoon(req: Request): Promise<IResponse> {
  return withDB(async () => {
    try {
      const { id, ...updateData } = await req.json();
      const updatedCartoon = await Cartoon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

      if (!updatedCartoon) return formatResponse(null, 'Cartoon not found', 404);
      return formatResponse(updatedCartoon, 'Cartoon updated successfully', 200);
    } catch (error: unknown) {
      if ((error as { code?: number }).code === 11000) {
        const err = error as { keyValue?: Record<string, unknown> };
        return formatResponse(null, `Duplicate key error: ${JSON.stringify(err.keyValue)}`, 400);
      }
      throw error;
    }
  });
}

export async function bulkUpdateCartoons(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const updates: { id: string; updateData: Record<string, unknown> }[] = await req.json();
    const results = await Promise.allSettled(
      updates.map(({ id, updateData }) =>
        Cartoon.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        }),
      ),
    );

    const successfulUpdates = results.filter((r): r is PromiseFulfilledResult<unknown> => r.status === 'fulfilled' && r.value).map(r => r.value);

    const failedUpdates = results
      .map((r, i) => (r.status === 'rejected' || !('value' in r && r.value) ? updates[i].id : null))
      .filter((id): id is string => id !== null);

    return formatResponse({ updated: successfulUpdates, failed: failedUpdates }, 'Bulk update completed', 200);
  });
}

export async function deleteCartoon(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { id } = await req.json();
    const deletedCartoon = await Cartoon.findByIdAndDelete(id);
    if (!deletedCartoon) return formatResponse(null, 'Cartoon not found', 404);
    return formatResponse({ deletedCount: 1 }, 'Cartoon deleted successfully', 200);
  });
}

export async function bulkDeleteCartoons(req: Request): Promise<IResponse> {
  return withDB(async () => {
    const { ids }: { ids: string[] } = await req.json();
    const deletedIds: string[] = [];
    const invalidIds: string[] = [];

    for (const id of ids) {
      try {
        const doc = await Cartoon.findById(id);
        if (doc) {
          const deletedDoc = await Cartoon.findByIdAndDelete(id);
          if (deletedDoc) {
            deletedIds.push(id);
          }
        } else {
          invalidIds.push(id);
        }
      } catch {
        invalidIds.push(id);
      }
    }

    return formatResponse({ deleted: deletedIds.length, deletedIds, invalidIds }, 'Bulk delete operation completed', 200);
  });
}

```

cartoons/route.ts
```
import { handleRateLimit } from '@/app/api/utils/rate-limit';
import { getCartoons, createCartoon, updateCartoon, deleteCartoon, getCartoonById, bulkUpdateCartoons, bulkDeleteCartoons } from './controller';
import { isUserHasAccessByRole, IWantAccess } from '../../utils/is-user-has-access-by-role';
import { formatResponse, IResponse } from '@/app/api/utils/jwt-verify';

export async function GET(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'cartoons',
    access: 'read',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const id = new URL(req.url).searchParams.get('id');
  const result: IResponse = id ? await getCartoonById(req) : await getCartoons(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function POST(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'cartoons',
    access: 'create',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const result = await createCartoon(req);
  return formatResponse(result.data, result.message, result.status);
}

export async function PUT(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'cartoons',
    access: 'update',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkUpdateCartoons(req) : await updateCartoon(req);

  return formatResponse(result.data, result.message, result.status);
}

export async function DELETE(req: Request) {
  const rateLimitResponse = handleRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const wantToAccess: IWantAccess = {
    db_name: 'cartoons',
    access: 'delete',
  };
  const isAccess = await isUserHasAccessByRole(wantToAccess);
  if (isAccess) return isAccess;

  const isBulk = new URL(req.url).searchParams.get('bulk') === 'true';
  const result = isBulk ? await bulkDeleteCartoons(req) : await deleteCartoon(req);

  return formatResponse(result.data, result.message, result.status);
}

```

and redux/cartoonsSlice.ts
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
--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------
here is interface for my dashboard example.ts
```

```

Now your task is generate those file for example
1. example/model.ts
2. example/controller.ts
3. example/route.ts
4. redux/exampleSlice.ts