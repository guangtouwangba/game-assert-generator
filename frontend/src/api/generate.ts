import client from "./client";
import type {
  GenerateRequest,
  SpriteSheetRequest,
  Generation,
  UploadResponse,
} from "../types";

export async function generateImage(req: GenerateRequest): Promise<Generation> {
  const { data } = await client.post<Generation>("/generate", req);
  return data;
}

export async function generateSpriteSheet(
  req: SpriteSheetRequest
): Promise<Generation> {
  const { data } = await client.post<Generation>(
    "/generate/sprite-sheet",
    req
  );
  return data;
}

export async function uploadReference(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await client.post<UploadResponse>(
    "/upload-reference",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}
