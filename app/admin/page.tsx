import type { Metadata } from "next";
import AdminEstimates from "./AdminEstimates";

export const metadata: Metadata = {
  title: "Admin Estimates | Forever Marble",
  description: "Internal estimate request dashboard for Forever Marble.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminEstimates />;
}
