"use client";
// ref https://github.com/payloadcms/payload/issues/12344#issuecomment-2867110662
// workaround for Breadcrumbs not working when using DefaultTemplate
import { useEffect } from "react";
import { useStepNav } from "@payloadcms/ui";

export function SetStepNav() {
  const { setStepNav } = useStepNav();

  useEffect(() => {
    // Define your breadcrumb path. The first entry should be the "home"/dashboard.
    // Subsequent entries represent the current custom view trail.
    setStepNav([
      {
        label: "Sites Roles and Permissions",
        url: "/admin/sites-roles-and-permissions", // your custom view route
      },
    ]);

    // Optional: on unmount, clear or reset to dashboard-only
    return () => {
      try {
        setStepNav([
          { label: "Dashboard", url: "/admin" },
        ]);
      } catch {
        /* no-op */
      }
    };
  }, [setStepNav]);

  // This component only sets step nav; it renders nothing.
  return null;
}
