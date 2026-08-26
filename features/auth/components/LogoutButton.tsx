"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/features/global/components/Button";

export function LogoutButton() {
  return (
    <Button 
      variant="danger" 
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Logout
    </Button>
  );
}