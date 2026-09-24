import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

import {
  cancelRequest,
  estimateGeneration,
  getRequestStatus,
  submitGeneration,
  verifyHiggsfieldAuthentication,
} from "@/lib/higgsfield-api";

// One 30-second 720p Seedance 2.5 job can exceed the previous $2 limit.
// Keep a server ceiling as well as the caller's per-generation max_usd.
const DEFAULT_HARD_CAP_USD = 15;

function hardCapUsd() {
  const configured = Number(process.env.SCROLLSPRINT_MCP_MAX_SINGLE_GENERATION_USD);
  return Number.isFinite(configured) && configured > 0
    ? configured
    : DEFAULT_HARD_CAP_USD;
}

function asUsd(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function textResult(payload: unknown, isError = false) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload, null, 2),
      },
    ],
    ...(isError ? { isError: true } : {}),
  };
}

const endpointSchema = z
  .string()
  .min(1)
  .describe(
    "Higgsfield model endpoint without the api.higgsfield.ai host, for example bytedance/seedance-2.0/text-to-video",
  );

const inputSchema = z
  .record(z.string(), z.unknown())
  .describe("Exact JSON input object accepted by the selected Higgsfield model endpoint");

export function buildHiggsfieldMcpServer() {
  const server = new McpServer({
    name: "scrollsprint-higgsfield",
    version: "1.1.0",
  });

  server.registerTool(
    "higgsfield_auth_status",
    {
      title: "Check Higgsfield PAYG connection",
      description:
        "Use this to verify that the ScrollSprint server can authenticate to the Higgsfield PAYG API. It does not create a generation or spend credits.",
      inputSchema: z.object({}),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async () => {
      try {
        const result = await verifyHiggsfieldAuthentication();
        return textResult({
          ok: result.authenticated,
          ...result,
          walletBalance: null,
          walletBalanceNote:
            "Higgsfield does not currently document a public wallet-balance endpoint. Use estimates plus your planning balance to track projected spend.",
          hardGenerationCapUsd: hardCapUsd(),
        });
      } catch (error) {
        return textResult(
          { ok: false, error: error instanceof Error ? error.message : String(error) },
          true,
        );
      }
    },
  );

  server.registerTool(
    "higgsfield_estimate",
    {
      title: "Estimate Higgsfield generation cost",
      description:
        "Estimate a Higgsfield generation before spending money. Pass the exact model endpoint and input JSON you plan to use. Returns Higgsfield's current credits and USD estimate. Always use this before higgsfield_generate when planning a new creative.",
      inputSchema: z.object({
        endpoint: endpointSchema,
        input: inputSchema,
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ endpoint, input }) => {
      try {
        const estimate = await estimateGeneration(endpoint, input);
        return textResult({ ok: true, endpoint, estimate, hardGenerationCapUsd: hardCapUsd() });
      } catch (error) {
        return textResult(
          { ok: false, error: error instanceof Error ? error.message : String(error) },
          true,
        );
      }
    },
  );

  server.registerTool(
    "higgsfield_generate",
    {
      title: "Generate media with Higgsfield PAYG",
      description:
        "Submit one Higgsfield PAYG generation. This spends account credits. The server re-estimates immediately before submission and refuses the request if the USD estimate exceeds max_usd or the server hard cap. After a successful call, use higgsfield_status with the returned request_id until a terminal state is reached.",
      inputSchema: z.object({
        endpoint: endpointSchema,
        input: inputSchema,
        max_usd: z
          .number()
          .positive()
          .max(15)
          .default(1)
          .describe(
            "Maximum USD you authorize for this single generation. The server also enforces its own hard cap.",
          ),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ endpoint, input, max_usd }) => {
      try {
        const estimate = await estimateGeneration(endpoint, input);
        const estimatedUsd = asUsd(estimate.usd);
        const hardCap = hardCapUsd();

        if (estimatedUsd === null) {
          return textResult(
            {
              ok: false,
              blocked: true,
              reason: "Higgsfield estimate did not include a parseable USD amount, so generation was not submitted.",
              estimate,
            },
            true,
          );
        }

        if (estimatedUsd > max_usd) {
          return textResult(
            {
              ok: false,
              blocked: true,
              reason: `Estimated cost $${estimatedUsd.toFixed(4)} exceeds the authorized max_usd $${max_usd.toFixed(4)}.`,
              estimate,
            },
            true,
          );
        }

        if (estimatedUsd > hardCap) {
          return textResult(
            {
              ok: false,
              blocked: true,
              reason: `Estimated cost $${estimatedUsd.toFixed(4)} exceeds the server hard cap $${hardCap.toFixed(4)}.`,
              estimate,
            },
            true,
          );
        }

        const generation = await submitGeneration(endpoint, input);
        return textResult({
          ok: true,
          endpoint,
          estimate,
          chargedAtMostUsd: Math.min(max_usd, hardCap),
          generation,
          nextStep:
            generation.request_id
              ? `Poll higgsfield_status with request_id ${generation.request_id} until completed, failed, canceled, cancelled, or moderated.`
              : "Inspect the returned generation payload for its request/status URL before retrying. Do not submit a duplicate generation automatically.",
        });
      } catch (error) {
        return textResult(
          { ok: false, error: error instanceof Error ? error.message : String(error) },
          true,
        );
      }
    },
  );

  server.registerTool(
    "higgsfield_status",
    {
      title: "Get Higgsfield request status",
      description:
        "Read the current state and outputs of an existing Higgsfield request. Use this after higgsfield_generate and poll with reasonable backoff until a terminal state is returned.",
      inputSchema: z.object({
        request_id: z.string().min(1),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ request_id }) => {
      try {
        const status = await getRequestStatus(request_id);
        return textResult({ ok: true, request_id, status });
      } catch (error) {
        return textResult(
          { ok: false, request_id, error: error instanceof Error ? error.message : String(error) },
          true,
        );
      }
    },
  );

  server.registerTool(
    "higgsfield_cancel",
    {
      title: "Cancel queued Higgsfield request",
      description:
        "Cancel a Higgsfield request that is still queued. This changes request state and should only be used when the user wants the queued generation stopped.",
      inputSchema: z.object({
        request_id: z.string().min(1),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ request_id }) => {
      try {
        const result = await cancelRequest(request_id);
        return textResult({ ok: true, request_id, result });
      } catch (error) {
        return textResult(
          { ok: false, request_id, error: error instanceof Error ? error.message : String(error) },
          true,
        );
      }
    },
  );

  return server;
}
