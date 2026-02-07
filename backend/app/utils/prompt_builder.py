def build_game_asset_prompt(
    prompt: str,
    negative_prompt: str | None = None,
    transparent_bg: bool = False,
    is_sprite_sheet: bool = False,
    sprite_config: dict | None = None,
) -> str:
    parts: list[str] = [f"Game asset: {prompt}"]

    if negative_prompt:
        parts.append(f"Avoid: {negative_prompt}")

    if transparent_bg:
        parts.append(
            "with transparent background, PNG format, no background"
        )

    if is_sprite_sheet:
        cfg = sprite_config or {}
        cols = cfg.get("cols", 4)
        rows = cfg.get("rows", 4)
        frame_count = cfg.get("frame_count", cols * rows)
        parts.append(
            f"as a sprite sheet grid with {cols} columns and {rows} rows, "
            f"{frame_count} frames total, each frame showing a different "
            "animation pose, consistent style across all frames"
        )

    return ", ".join(parts)
