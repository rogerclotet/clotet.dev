import {
	type Envelope,
	type ErrorEvent,
	type EventEnvelope,
	type StackFrame,
	uuid4,
} from "@sentry/core";

function record(value: unknown): Record<string, unknown> | undefined {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? Object.fromEntries(Object.entries(value))
		: undefined;
}

function text(value: unknown): string | undefined {
	return typeof value === "string" ? value : undefined;
}

function number(value: unknown): number | undefined {
	return typeof value === "number" && Number.isFinite(value)
		? value
		: undefined;
}

// Only bundled code locations are useful here. Never retain page URLs, query
// strings, browser-extension URLs, or absolute paths outside the build output.
function codeLocation(value: unknown): string | undefined {
	const path = text(value)?.split(/[?#]/)[0]?.replaceAll("\\", "/");
	if (!path) return undefined;
	const next = path.indexOf("/_next/");
	if (next !== -1) return `app://${path.slice(next)}`;
	const build = path.indexOf("/.next/");
	if (build !== -1) return `app:///_next/${path.slice(build + 7)}`;
	return undefined;
}

function stackFrame(value: unknown): StackFrame | undefined {
	const frame = record(value);
	const filename = codeLocation(frame?.filename);
	if (!frame || !filename) return undefined;
	return {
		filename,
		lineno: number(frame.lineno),
		colno: number(frame.colno),
		in_app: typeof frame.in_app === "boolean" ? frame.in_app : undefined,
	};
}

const errorTypes = new Set([
	"Error",
	"TypeError",
	"RangeError",
	"ReferenceError",
	"SyntaxError",
	"URIError",
	"EvalError",
	"AggregateError",
	"ChunkLoadError",
]);

// An allowlist also protects against fields added by future SDK versions.
// Preserve exception messages for debugging while excluding visitor context.
export function privateErrorEvent(value: unknown): ErrorEvent | null {
	const event = record(value);
	const exception = record(event?.exception);
	if (!event || event.type || !Array.isArray(exception?.values)) return null;
	const values = exception.values.flatMap((value: unknown) => {
		const error = record(value);
		if (!error) return [];
		const stack = record(error.stacktrace);
		const frames = Array.isArray(stack?.frames)
			? stack.frames.flatMap((value: unknown) => {
					const frame = stackFrame(value);
					return frame ? [frame] : [];
				})
			: [];
		const type = text(error.type);
		return [
			{
				type: type && errorTypes.has(type) ? type : "Error",
				value: text(error.value),
				stacktrace: { frames },
			},
		];
	});
	if (values.length === 0) return null;
	const debugMeta = record(event.debug_meta);
	const images = Array.isArray(debugMeta?.images)
		? debugMeta.images.flatMap((value: unknown) => {
				const image = record(value);
				const code_file = codeLocation(image?.code_file);
				const debug_id = text(image?.debug_id);
				return image?.type === "sourcemap" &&
					code_file &&
					debug_id &&
					/^[a-f0-9-]{36}$/i.test(debug_id)
					? [{ type: "sourcemap" as const, code_file, debug_id }]
					: [];
			})
		: [];
	const id = text(event.event_id);
	return {
		type: undefined,
		event_id: id && /^[a-f0-9]{32}$/i.test(id) ? id : undefined,
		timestamp: number(event.timestamp),
		level: "error",
		platform: "javascript",
		release: text(event.release),
		environment: text(event.environment),
		exception: { values },
		debug_meta: images.length ? { images } : undefined,
	};
}

// Drop non-error items and envelope-level trace metadata at the final boundary,
// including anything added by the SDK after beforeSend runs.
export function privateErrorEnvelope(envelope: Envelope): Envelope {
	const items: EventEnvelope[1] = envelope[1].flatMap(([header, payload]) => {
		if (header.type !== "event") return [];
		const event = privateErrorEvent(payload);
		return event
			? [[{ type: "event" }, event] satisfies Envelope[1][number]]
			: [];
	});
	return [
		{
			event_id:
				text(envelope[0].event_id)?.match(/^[a-f0-9]{32}$/i)?.[0] || uuid4(),
			sent_at: new Date().toISOString(),
		},
		items,
	];
}
