export const signup = async ({ email, password }) => {
  const response = await fetch("/api/auth/signup", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    method: "POST",
  });
  if (!response.ok) {
  } else {
    return await response.json();
  }
};



export const login = async ({ email, password }) => {
  const response = await fetch("/api/auth/login", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    method: "POST",
  });
  if (!response.ok) {
  } else {
    return await response.json();
  }
};

export const socialLogin = async ({ email }) => {
  const response = await fetch("/api/auth/social-login", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
    method: "POST",
  });
  if (!response.ok) {
  } else {
    return await response.json();
  }
};
