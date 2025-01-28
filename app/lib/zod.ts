import { z } from "zod";

export const updateVideoSchema = z.object({
  id: z.string().min(3),
  slug: z.string().min(3),
  index: z.number().min(1),
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
export type updateVideoType = z.infer<typeof updateVideoSchema>;
