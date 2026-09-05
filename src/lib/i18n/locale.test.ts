import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveLocale } from "./locale";

test("a saved choice takes precedence over browser preferences", () => {
	assert.equal(
		resolveLocale({ savedLanguage: "es", acceptLanguage: "ca,en;q=0.8" }),
		"es",
	);
	assert.equal(
		resolveLocale({ savedLanguage: "en", acceptLanguage: "ca" }),
		"en",
	);
});

test("matches regional language tags in preference order", () => {
	assert.equal(
		resolveLocale({ acceptLanguage: "ca-ES,es;q=0.9,en;q=0.8" }),
		"ca",
	);
	assert.equal(resolveLocale({ acceptLanguage: "es-MX,en-US;q=0.9" }), "es");
	assert.equal(
		resolveLocale({ acceptLanguage: "fr-FR, CA-es;q=0.8, en;q=0.5" }),
		"ca",
	);
	assert.equal(
		resolveLocale({ acceptLanguage: "en;q=0.5,es;q=0.9,ca;q=0.8" }),
		"es",
	);
	assert.equal(resolveLocale({ acceptLanguage: "ca;q=0.8,es;q=0.8" }), "ca");
});

test("ignores invalid cookies, rejected languages, and malformed weights", () => {
	assert.equal(
		resolveLocale({ savedLanguage: "fr", acceptLanguage: "es" }),
		"es",
	);
	assert.equal(resolveLocale({ acceptLanguage: "ca;q=0,es;q=0.5" }), "es");
	assert.equal(
		resolveLocale({
			acceptLanguage: "ca;q=invalid,es;q=2,en;q=-1,es-MX;q=0.5",
		}),
		"es",
	);
});

test("falls back to English when no supported preference is available", () => {
	for (const acceptLanguage of [null, "", "de,fr;q=0.9", "*"]) {
		assert.equal(resolveLocale({ acceptLanguage }), "en");
	}
});
