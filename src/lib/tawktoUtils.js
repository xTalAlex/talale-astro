export function getTawktoHash(email) {
  return fetch("/api/tawkto-hash", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
      return null;
    });
}

export function setTawktoAttributes({ name, email }) {
  if (email && name && window.Tawk_API) {
    getTawktoHash(email).then((data) => {
      window.Tawk_API.setAttributes({
        name: name,
        email: email,
        hash: data?.hash,
      });
      return true;
    });
  }
}
