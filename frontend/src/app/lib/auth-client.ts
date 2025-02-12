import { createAuthClient } from "better-auth/client";
import { redirect } from "next/navigation";
const authClient = createAuthClient();

export const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/hall",
  });
};

export const signOut = async () => {
  const signOut = await authClient.signOut();
  console.log(signOut);
  redirect("/login");
};

export const getSession = async () => {
  const session = await authClient.getSession();
  return session;
};

export const signInWithGithub = async () => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: "/hall",
  });
};
