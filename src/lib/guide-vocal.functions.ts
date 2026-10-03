import { createServerFn } from "@tanstack/react-start";

export type GuideResult = { ok: true; audioBase64: string } | { ok: false; error: string };

export const guideVocal = createServerFn({ method: "POST" })
  .validator((input: unknown): { text: string } => {
    const text =
      typeof input === "object" && input !== null && "text" in input && typeof input.text === "string"
        ? input.text.trim()
        : "";
    if (text.length < 8) throw new Error("The chorus is too short to speak.");
    return { text: text.slice(0, 480) };
  })
  .handler(async ({ data }): Promise<GuideResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "The spoken guide is unavailable right now." };

    let res: Response;
    try {
      res = await fetch("https://api.x.ai/v1/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: AbortSignal.timeout(40_000),
        body: JSON.stringify({
          text: data.text,
          voice_id: "eve",
          language: "en",
        }),
      });
    } catch (err) {
      console.error("[booth] guide failed", err instanceof Error ? err.name : "error");
      return { ok: false, error: "The spoken guide didn’t render." };
    }

    if (!res.ok) {
      console.error("[booth] guide status", res.status);
      return { ok: false, error: "The spoken guide didn’t render." };
    }

    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.byteLength < 400) return { ok: false, error: "The spoken guide came back empty." };
    return { ok: true, audioBase64: bytes.toString("base64") };
  });
