import { authClient } from "@src/lib/authClient";
import {
  isLogged,
  setAuthenticatedUser,
  clearAuthenticatedUser,
} from "@src/lib/authStore";

async function loadIdentity() {
  const { data: session } = await authClient.getSession().catch((e) => {
    console.error(e);
    return { data: null, error: e };
  });

  if (session?.user) {
    setAuthenticatedUser(session.user);
    document.dispatchEvent(new CustomEvent("loggedIn"));
  } else {
    clearAuthenticatedUser();
    document.dispatchEvent(new CustomEvent("loggedOut"));
  }
}

document.addEventListener("requestLogin", () => {
  if (!isLogged.get()) {
    const modal = document.getElementById("login_modal") as HTMLDialogElement;
    modal?.showModal();
  }
});

document.addEventListener("attemptLogin", async (e: Event) => {
  const { detail } = e as CustomEvent;
  if (!isLogged.get()) {
    const { method, email, password } = detail;

    const { error } =
      method === "google"
        ? await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
          })
        : await authClient.signIn.email({ email, password });

    if (error) {
      document.dispatchEvent(
        new CustomEvent("loginError", { detail: { message: error.message } }),
      );
    } else {
      (document.getElementById("login_modal") as HTMLDialogElement)?.close();
      loadIdentity();
    }
  }
});

document.addEventListener("requestPasswordReset", async (e: Event) => {
  const { email } = (e as CustomEvent).detail;

  if (!email) {
    document.dispatchEvent(
      new CustomEvent("passwordResetError", {
        detail: { message: "Inserisci la tua email prima di procedere." },
      }),
    );
  } else {
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    if (error) {
      document.dispatchEvent(
        new CustomEvent("passwordResetError", {
          detail: { message: error.message },
        }),
      );
    } else {
      (document.getElementById("login_modal") as HTMLDialogElement)?.close();
      document.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            message:
              "Email di recupero password inviata. Controlla la tua casella.",
            style: "success",
          },
        }),
      );
    }
  }
});

document.addEventListener("requestLogout", async () => {
  await authClient.signOut();
  window.location.reload();
});

loadIdentity();
