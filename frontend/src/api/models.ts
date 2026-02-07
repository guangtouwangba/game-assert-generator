import client from "./client";
import type { ModelsResponse } from "../types";

export async function getModels(): Promise<ModelsResponse> {
  const { data } = await client.get<ModelsResponse>("/models");
  return data;
}
