"use server";

import { PlatformFormData } from "@/types";
import { createPlatform, listPlatforms } from "../../lib/dynamodb";

export async function addPlatform(formData: PlatformFormData) {
  return await createPlatform(formData);
}

export async function fetchPlatforms() {
  return await listPlatforms();
}
