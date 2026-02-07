export interface SpriteConfig {
  rows: number;
  cols: number;
  frame_count: number;
}

export interface GenerateRequest {
  prompt: string;
  negative_prompt?: string;
  model: string;
  provider: "gemini" | "openrouter";
  aspect_ratio?: string;
  image_size?: string;
  transparent_bg?: boolean;
  reference_image_b64?: string;
}

export interface SpriteSheetRequest extends GenerateRequest {
  is_sprite_sheet: true;
  sprite_config: SpriteConfig;
}

export interface Generation {
  id: string;
  prompt: string;
  negative_prompt: string | null;
  model: string;
  provider: string;
  width: number | null;
  height: number | null;
  aspect_ratio: string | null;
  image_size: string | null;
  transparent_bg: boolean;
  is_sprite_sheet: boolean;
  sprite_config: SpriteConfig | null;
  reference_image_path: string | null;
  output_image_path: string | null;
  thumbnail_path: string | null;
  status: "pending" | "generating" | "completed" | "failed";
  error_message: string | null;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface GenerationListResponse {
  items: Generation[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
}

export interface ModelsResponse {
  models: ModelInfo[];
}

export interface UploadResponse {
  path: string;
  filename: string;
}
