import type { Metadata } from "next";
import ErrorButtons from "./error-buttons";

export const metadata: Metadata = {
	title: "Error reporting test",
	robots: { index: false, follow: false },
};

export default function ErrorTestPage() {
	return (
		<div className="mx-auto max-w-xl px-6 py-16">
			<h1 className="mb-4 text-3xl">Error reporting test</h1>
			<p className="mb-8 text-muted-foreground">
				Trigger an intentional error in the browser or on the server. Reporting
				requires a production build with GlitchTip configured.
			</p>
			<ErrorButtons />
		</div>
	);
}
