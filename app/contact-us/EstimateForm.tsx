"use client";

import { FormEvent } from "react";

type StoredEstimate = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  project: string;
  material: string;
  message: string;
  status: "New";
};

export default function EstimateForm() {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const estimate: StoredEstimate = {
      id: `FM-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      project: String(form.get("project") || ""),
      material: String(form.get("material") || ""),
      message: String(form.get("message") || ""),
      status: "New",
    };

    try {
      const existing = JSON.parse(window.localStorage.getItem("foreverMarbleEstimates") || "[]");
      window.localStorage.setItem("foreverMarbleEstimates", JSON.stringify([estimate, ...existing]));
    } catch {
      // The email fallback below still works if browser storage is unavailable.
    }

    const body = [
      `Name: ${estimate.name}`,
      `Phone: ${estimate.phone}`,
      `Email: ${estimate.email}`,
      `Project type: ${estimate.project}`,
      `Material: ${estimate.material}`,
      `Message: ${estimate.message}`,
    ].join("\n");

    window.location.href = `mailto:granite@forevermarble.com?subject=${encodeURIComponent(
      "Countertop estimate request",
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="estimate-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          First and last name
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          Phone
          <input name="phone" required type="tel" autoComplete="tel" />
        </label>
      </div>
      <label>
        Email address
        <input name="email" required type="email" autoComplete="email" />
      </label>
      <div className="form-row">
        <label>
          Project type
          <select name="project" defaultValue="Kitchen">
            <option>Kitchen</option>
            <option>Bathroom</option>
            <option>Fireplace</option>
            <option>Bar or other</option>
          </select>
        </label>
        <label>
          Material of interest
          <select name="material" defaultValue="Not sure yet">
            <option>Not sure yet</option>
            <option>Granite</option>
            <option>Marble</option>
            <option>Quartz</option>
            <option>Quartzite</option>
          </select>
        </label>
      </div>
      <label>
        Tell us about your project
        <textarea name="message" rows={5} placeholder="Approximate dimensions, timeline, colors you like..." />
      </label>
      <button className="button gold" type="submit">
        Send estimate request
      </button>
      <small>This opens your email app and saves a local copy for the admin estimate view.</small>
    </form>
  );
}
