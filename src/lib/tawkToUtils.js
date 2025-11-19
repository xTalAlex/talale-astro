export async function getTawktoHash(email) {
  const data = await fetch("/api/tawkto-hash", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  }).then((response) => response.json());
  return data;
}

export function setTawktoAttributes({ name, email }) {
  getTawktoHash(email).then((data) => {
    window.Tawk_API.setAttributes({
      name: name,
      email: email,
      hash: data.hash,
    });
    return true;
  });
}
