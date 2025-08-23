import { z } from "zod";

export const LinkSchema = z.object({
  type: z.enum(
    [
      "TWITTER",
      "GITHUB",
      "LINKEDIN",
      "PORTFOLIO",
      "MEDIUM",
      "BLOG",
      "YOUTUBE",
      "FACEBOOK",
      "INSTAGRAM",
    ],
    {
      message: "Link type is required and must be one of the predefined values",
    }
  ),

  name: z.string().min(1, { message: "Name is required" }),

  logo: z.string().url({ message: "Logo must be a valid URL" }),
});

export const LinksSchema = z.object({
  links: z.array(LinkSchema),
});

export type Link = z.infer<typeof LinkSchema>;
