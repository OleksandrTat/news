"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: readonly string[];
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const storedUid = sessionStorage.getItem("uid");
      const storedSig = sessionStorage.getItem("sig");
      const storedRoleUid = sessionStorage.getItem("ifphub_user_role_uid");
      let storedRole =
        sessionStorage.getItem("ifphub_user_role")?.trim().toLowerCase() ?? "";

      if (!storedUid || !storedSig) {
        router.replace("/");
        return;
      }

      if (storedRole && storedRoleUid && storedRoleUid !== String(storedUid)) {
        sessionStorage.removeItem("ifphub_user_role");
        storedRole = "";
      }

      if (allowedRoles && allowedRoles.length > 0) {
        if (!storedRole || !allowedRoles.includes(storedRole)) {
          try {
            const res = await fetch(
              `/api/usuario/rol?uid=${encodeURIComponent(storedUid)}&sig=${encodeURIComponent(storedSig)}`,
              { cache: "no-store" }
            );
            if (res.ok) {
              const data = await res.json();
              const role = String(data?.rol ?? "")
                .trim()
                .toLowerCase();
              if (role) {
                sessionStorage.setItem("ifphub_user_role_uid", storedUid);
                sessionStorage.setItem("ifphub_user_role", role);
                storedRole = role;
              }
            }
          } catch {
            // Si falla, tratamos como no autorizado.
          }
        }

        if (!storedRole || !allowedRoles.includes(storedRole)) {
          router.replace("/noticias");
          return;
        }
      }

      if (active) setChecked(true);
    };

    run();

    return () => {
      active = false;
    };
  }, [router, allowedRoles]);

  if (!checked) return null;

  return <>{children}</>;
}
