import { z } from "zod";

export const updateVideoSchema = z.object({
  slug: z.string(),
  index: z.number(),
  title: z.string(),

  isPublic: z.boolean().default(false),
  m3u8: z.array(z.string()).default([]),

  poster: z.string().optional(),
  type: z.string().optional(),
  authorName: z.string().optional(),
  photoUrl: z.string().optional(),
  description: z.string().optional(),
  storageLink: z.string().optional(),
  storageKey: z.string().optional(),
  duration: z.coerce.number().optional(),
  moduleName: z.string().optional(),
  courseIds: z.array(z.string()),
});
export type updateVideoType = z.infer<typeof updateVideoSchema>;
