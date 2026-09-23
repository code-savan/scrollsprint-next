import "dotenv/config";
import { config, higgsfield } from "@higgsfield/client/v2";

const credentials = process.env.HF_CREDENTIALS;

if (!credentials) {
  console.error("HF_CREDENTIALS is not set. Add it to .env.local in KEY_ID:KEY_SECRET format.");
  process.exit(1);
}

config({ credentials });

try {
  const result = await higgsfield.subscribe(
    "bytedance/seedance-2.5/text-to-video",
    {
      input: {
        prompt: "A cinematic scene at sunset",
        duration: 5,
        resolution: "720p",
        aspect_ratio: "16:9",
        output_format: "mp4",
        generate_audio: true,
      },
      withPolling: true,
    },
  );

  const payload = result as Record<string, unknown>;
  const status = typeof payload.status === "string" ? payload.status.toLowerCase() : undefined;

  if (status && ["failed", "canceled", "cancelled", "moderated"].includes(status)) {
    console.error(`Generation ended with status: ${status}`);
    process.exit(1);
  }

  const video = payload.video as { url?: string } | string | undefined;
  const videoUrl = typeof video === "string" ? video : video?.url;

  if (!videoUrl) {
    console.error("Generation finished without a video URL.");
    process.exit(1);
  }

  console.log(videoUrl);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown Higgsfield SDK error";
  console.error(`Higgsfield generation failed: ${message}`);
  process.exit(1);
}
