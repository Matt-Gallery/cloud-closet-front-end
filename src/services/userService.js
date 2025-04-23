const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/users`;

export const index = async () => {
  try {
    const res = await fetch(`${BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (error) {
    console.log(err);
    throw new Error(err);
  }
};

export const show = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (error) {
    console.log(err);
    throw new Error(err);
  }
};
