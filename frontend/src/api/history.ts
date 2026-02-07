import client from "./client";
import type { Generation, GenerationListResponse } from "../types";

export interface HistoryParams {
  page?: number;
  page_size?: number;
  provider?: string;
  search?: string;
}

export async function getHistory(
  params: HistoryParams = {}
): Promise<GenerationListResponse> {
  const { data } = await client.get<GenerationListResponse>("/history", {
    params,
  });
  return data;
}

export async function getGeneration(id: string): Promise<Generation> {
  const { data } = await client.get<Generation>(`/history/${id}`);
  return data;
}

export async function deleteGeneration(id: string): Promise<void> {
  await client.delete(`/history/${id}`);
}
