"use server";

import { createPlatform, getPlatformById } from "../../lib/dynamodb";

export async function addPlatform(formData: FormData) {
  const name = formData.get("name") as string;
  return await createPlatform({ name, category: "test" });
}

export async function fetchPlatform(id: string) {
  return await getPlatformById(id);
}
