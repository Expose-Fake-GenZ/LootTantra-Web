"use server";

import { ReportFormData } from "@/types";
import { createReport, listReports } from "../../lib/dynamodb";

export async function addReport(formData: ReportFormData) {
  return await createReport(formData);
}

export async function fetchReports() {
  return await listReports();
}
