import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useGreeting() {
  return useQuery({
    queryKey: [api.greeting.get.path],
    queryFn: async () => {
      const res = await fetch(api.greeting.get.path, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch greeting");
      }
      const data = await res.json();
      return api.greeting.get.responses[200].parse(data);
    },
    retry: false, // Don't retry infinitely if backend isn't up yet
  });
}
