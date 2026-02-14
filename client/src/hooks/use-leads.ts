import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// Schema for the external API response
export const leadSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string().optional(),
    bs: z.string().optional(),
  }),
});

export type Lead = z.infer<typeof leadSchema>;

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      return z.array(leadSchema).parse(data);
    },
  });
}
