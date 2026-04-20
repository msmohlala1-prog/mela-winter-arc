"use client";

import { createClient } from "@/lib/supabase/client";

interface SignupPayload {
  name?: string;
  email?: string;
}

export async function storeArcSignup({ name, email }: SignupPayload) {
  const supabase = createClient();

  if (!supabase) {
    return;
  }

  const cleanName = name?.trim() || null;
  const cleanEmail = email?.trim() || null;

  if (!cleanName && !cleanEmail) {
    return;
  }

  await supabase.from("arc_signups").insert({
    name: cleanName,
    email: cleanEmail,
    created_at: new Date().toISOString()
  });
}
