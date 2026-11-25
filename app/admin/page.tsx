import type { Metadata } from "next";
import AdminEstimates from "./AdminEstimates";

export const metadata: Metadata = {
  title: "Admin Dashboard | Forever Marble",
  description: "Manage Forever Marble estimates, website photos and authorized users.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminEstimates />;
}
