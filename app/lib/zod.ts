import { z } from "zod";

const CourseId = z.string().min(3);
export const createVideoSchema = z.object({
  index: z.coerce.number().min(1),
  slug: z.string().min(3),
  title: z.string().min(3),
  moduleName: z.string().min(3),
  courseIds: z.array(CourseId).min(1),
});

export const updateVideoSchema = z.object({
  id: z.string().min(3),
  slug: z.string().min(3),
  index: z.coerce.number().min(1),
  title: z.string().min(3),

  isPublic: z.boolean().default(false),
  m3u8: z.array(z.string()).default([]),

  poster: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  authorName: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  storageLink: z.string().optional().nullable(),
  storageKey: z.string().optional().nullable(),
  duration: z.string().optional().nullable().default("0"),
  moduleName: z.string().optional().nullable(),
  courseIds: z.array(z.string()),
});
export type UpdateVideoType = z.infer<typeof updateVideoSchema>;
export type CreateVideoSchema = z.infer<typeof createVideoSchema>;
