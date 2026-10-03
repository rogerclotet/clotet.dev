import { parseEnvelope, serializeEnvelope } from "@sentry/core";
import { privateErrorEnvelope } from "@/lib/glitchtip/privacy";

const maxBytes = 64 * 1024;

export async function POST(request: Request) {
	const configuredDsn = process.env.NEXT_PUBLIC_GLITCHTIP_DSN;
	if (!configuredDsn || process.env.NODE_ENV !== "production") {
		return new Response(null, { status: 204 });
	}

	// The destination comes only from trusted configuration, never the envelope.
	const dsn = new URL(configuredDsn);
	const project = dsn.pathname.split("/").pop();
	const prefix = dsn.pathname.slice(0, dsn.pathname.lastIndexOf("/"));
	const endpoint = new URL(`${prefix}/api/${project}/envelope/`, dsn.origin);
	endpoint.searchParams.set("sentry_key", dsn.username);
	endpoint.searchParams.set("sentry_version", "7");

	// Bound the body while streaming, including requests without Content-Length.
	const reader = request.body?.getReader();
	if (!reader) return new Response(null, { status: 400 });
	const chunks: Uint8Array[] = [];
	let size = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		size += value.byteLength;
		if (size > maxBytes) {
			await reader.cancel();
			return new Response(null, { status: 413 });
		}
		chunks.push(value);
	}
	const body = new Uint8Array(size);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}

	let outgoing: string | Uint8Array;
	try {
		const envelope = privateErrorEnvelope(parseEnvelope(body));
		if (!envelope[1].length) return new Response(null, { status: 204 });
		outgoing = serializeEnvelope(envelope);
	} catch {
		return new Response(null, { status: 400 });
	}

	try {
		const upstream = await fetch(endpoint, {
			method: "POST",
			body: typeof outgoing === "string" ? outgoing : new Uint8Array(outgoing),
			// Never forward visitor headers, cookies, IP addresses, or referrers.
			headers: { "Content-Type": "application/x-sentry-envelope" },
			credentials: "omit",
			redirect: "error",
			signal: AbortSignal.timeout(5000),
		});
		await upstream.body?.cancel();
		return new Response(null, {
			status: upstream.ok ? 204 : upstream.status,
			headers: {
				"Cache-Control": "no-store",
				...(upstream.headers.has("retry-after")
					? { "Retry-After": upstream.headers.get("retry-after") ?? "" }
					: {}),
				...(upstream.headers.has("x-sentry-rate-limits")
					? {
							"X-Sentry-Rate-Limits":
								upstream.headers.get("x-sentry-rate-limits") ?? "",
						}
					: {}),
			},
		});
	} catch {
		// Reporting failures must not recursively report themselves.
		return new Response(null, { status: 502 });
	}
}
