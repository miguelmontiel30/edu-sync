// Config
import { supabaseClient } from "@/services/config/supabaseClient";

export async function login(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function logout() {
  await supabaseClient.auth.signOut();
}

export async function getUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) return null;

  return data.user;
}
