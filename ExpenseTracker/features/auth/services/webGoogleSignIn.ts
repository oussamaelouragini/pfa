// Web-only Google Sign-In using Google Identity Services (GIS)

const GIS_SRC = "https://accounts.gstatic.com/gsi/client";

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Google Identity Services"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export async function signInWithGoogle(clientId: string): Promise<string> {
  await loadScript();

  const google = (window as any).google;
  if (!google?.accounts?.oauth2) {
    throw new Error("Google Identity Services not available");
  }

  return new Promise<string>((resolve, reject) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        reject(new Error("Google sign-in timed out"));
      }
    }, 120_000);

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid profile email",
      callback: (response: any) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeout);
        if (response.error) {
          reject(new Error(response.error_description || response.error));
        } else if (response.id_token) {
          resolve(response.id_token);
        } else {
          reject(new Error("No ID token in Google response"));
        }
      },
    });

    tokenClient.requestAccessToken();
  });
}
