"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const estimateConversion = "AW-1034233006/-iDbCJHYzoEdEK7JlO0D";

function trackEstimateConversion(estimateId: string) {
  return new Promise<void>((resolve) => {
    if (!window.gtag) {
      resolve();
      return;
    }

    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      resolve();
    };

    window.gtag("event", "conversion", {
      send_to: estimateConversion,
      transaction_id: estimateId,
      value: 1,
      currency: "USD",
      event_callback: finish,
      event_timeout: 2000,
    });

    window.setTimeout(finish, 2200);
  });
}

export default function EstimateForm() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    const element = event.currentTarget; const form = new FormData(element);
    const estimate = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/.netlify/functions/estimates", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(estimate) });
      if (response.status !== 201) throw new Error("Submission failed");
      const saved = await response.json();
      if (!saved.ok || typeof saved.id !== "string" || !saved.id) throw new Error("Estimate was not saved");
      element.reset();
      setState("sent");
      await trackEstimateConversion(saved.id).catch(() => undefined);
      router.push("/thank-you/");
    } catch { setState("error"); }
  }

  return <form className="estimate-form" onSubmit={submit}>
    <div className="estimate-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-row"><label>First and last name<input name="name" required autoComplete="name" /></label><label>Phone<input name="phone" required type="tel" autoComplete="tel" /></label></div>
    <label>Email address<input name="email" required type="email" autoComplete="email" /></label>
    <div className="form-row"><label>Project type<select name="project" defaultValue="Kitchen"><option>Kitchen</option><option>Bathroom</option><option>Fireplace</option><option>Bar or other</option></select></label><label>Material of interest<select name="material" defaultValue="Not sure yet"><option>Not sure yet</option><option>Granite</option><option>Marble</option><option>Quartz</option><option>Quartzite</option></select></label></div>
    <label>Tell us about your project<textarea name="message" rows={5} placeholder="Approximate dimensions, timeline, colors you like..." /></label>
    <button className="button gold" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send estimate request"}</button>
    {state === "sent" ? <p className="form-success" role="status">Thank you. Your estimate request was received.</p> : null}
    {state === "error" ? <p className="form-error" role="alert">We could not send your request. Please call (215) 203-8666.</p> : null}
  </form>;
}
