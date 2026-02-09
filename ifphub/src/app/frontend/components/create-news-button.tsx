"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NEWS_CREATOR_ROLES } from "@/app/utils/roles";

type Props = {
  className?: string;
  label?: string;
  uid?: string | number | null;
  sig?: string | null;
};

export default function CreateNewsButton({
  className,
  label = "Crear noticia",
  uid: uidProp = null,
  sig: sigProp = null,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const storedUid = sessionStorage.getItem("uid");
      const storedSig = sessionStorage.getItem("sig");
      const storedRoleUid = sessionStorage.getItem("ifphub_user_role_uid");
      const uid = String(uidProp ?? storedUid ?? "").trim();
      const sig = String(sigProp ?? storedSig ?? "").trim();
      let role =
        sessionStorage.getItem("ifphub_user_role")?.trim().toLowerCase() ?? "";

      if (!uid || !sig) {
        if (active) setVisible(false);
        return;
      }

      if (role && storedRoleUid && storedRoleUid !== uid) {
        sessionStorage.removeItem("ifphub_user_role");
        role = "";
      }

      if (!role || !NEWS_CREATOR_ROLES.includes(role as (typeof NEWS_CREATOR_ROLES)[number])) {
        try {
          const res = await fetch(
            `/api/usuario/rol?uid=${encodeURIComponent(uid)}&sig=${encodeURIComponent(sig)}`,
            { cache: "no-store" }
          );
          if (res.ok) {
            const data = await res.json();
            const fetchedRole = String(data?.rol ?? "")
              .trim()
              .toLowerCase();
            if (fetchedRole) {
              sessionStorage.setItem("ifphub_user_role_uid", uid);
              sessionStorage.setItem("ifphub_user_role", fetchedRole);
              role = fetchedRole;
            }
          }
        } catch {
          // Si falla, ocultamos el botón.
        }
      }

      const allowed = NEWS_CREATOR_ROLES.includes(
        role as (typeof NEWS_CREATOR_ROLES)[number]
      );

      if (active) setVisible(allowed);
    };

    run();

    return () => {
      active = false;
    };
  }, [uidProp, sigProp]);

  if (!visible) return null;

  return (
    <Link href="/noticias/nueva" className={className}>
      {label}
    </Link>
  );
}
