"use client";

import { useState } from "react";

export default function ErrorButtons() {
	const [serverStatus, setServerStatus] = useState("");
	const [pending, setPending] = useState(false);
	const buttonClassName =
		"rounded border border-secondary px-4 py-2 text-secondary hover:bg-secondary hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary disabled:opacity-50";

	async function triggerServerError() {
		setPending(true);
		setServerStatus("Sending server request...");
		try {
			const response = await fetch("/error-test/server", { method: "POST" });
			setServerStatus(`Server responded with HTTP ${response.status}.`);
		} catch {
			setServerStatus("Could not reach the server. Try again.");
		} finally {
			setPending(false);
		}
	}

	return (
		<>
			<div className="flex flex-wrap gap-4">
				<button
					type="button"
					className={buttonClassName}
					onClick={() => {
						throw new Error("Error test: intentional client error");
					}}
				>
					Trigger client error
				</button>
				<button
					type="button"
					className={buttonClassName}
					onClick={triggerServerError}
					disabled={pending}
				>
					Trigger server error
				</button>
			</div>
			<p role="status" className="mt-4 text-muted-foreground">
				{serverStatus}
			</p>
		</>
	);
}
