<<<<<<< HEAD
const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;
=======
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`;
>>>>>>> ad1884a942d98c31e59242425d528f0b9fb1c0ec

export const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Data: ", data);

    if (data.err) {
      throw new Error(data.err);
    }

    if (!data.token) {
      throw new Error("Invalid response from server");
    }

    localStorage.setItem("token", data.token);
    return JSON.parse(atob(data.token.split(".")[1])).payload;
  } catch (err) {
    console.log(err);
    //throw new Error(err);
  }
};

export const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error(`Sign-in failed: ${res.status}`);
    }

    const text = await res.text();
    if (!text) throw new Error("Empty response from server");

    const data = JSON.parse(text);

    if (!data.token) {
      throw new Error("Missing token in response");
    }

    localStorage.setItem("token", data.token);
    return JSON.parse(atob(data.token.split(".")[1])).payload;
  } catch (err) {
    console.error("❌ Sign-In Error:", err);
  }
};
