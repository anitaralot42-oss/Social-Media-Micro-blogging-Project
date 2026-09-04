const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...(options.headers || {}),
  };

  // JSON request ke liye Content-Type set karo
  // FormData ke liye browser khud Content-Type set karega
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}

export const api = {

  // =========================
  // AUTH
  // =========================

  register: (d) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(d),
    }),

  login: (d) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(d),
    }),

  forgotPassword: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, newPassword) =>
    request(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({ newPassword }),
    }),

  // =========================
  // POSTS
  // =========================

  getPosts: () =>
    request(`/posts?_=${Date.now()}`),

  createPost: (content, media) => {
    const formData = new FormData();

    if (content.trim()) {
      formData.append("content", content);
    }

    if (media) {
      formData.append("media", media);
    }

    return request("/posts", {
      method: "POST",
      body: formData,
    });
  },

  updatePost: (id, content) =>
    request(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    }),

  deletePost: (id) =>
    request(`/posts/${id}`, {
      method: "DELETE",
    }),

  likePost: (id) =>
    request(`/posts/${id}/like`, {
      method: "POST",
    }),

  commentPost: (id, text) =>
    request(`/posts/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  // =========================
  // USERS
  // =========================

  getMe: () =>
    request("/users/me"),

  updateProfile: (d) =>
    request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(d),
    }),

  updateProfilePicture: (file) => {
    const formData = new FormData()
    formData.append('profilePicture', file)

    return request('/users/me/profile-picture', {
      method: 'PUT',
      body: formData
    })
  },

  removeProfilePicture: () =>
    request('/users/me/profile-picture', {
      method: 'DELETE'
    }),

  getUserProfile: (id) =>
    request(`/users/${id}`),

  getUsers: () =>
    request("/users"),

  searchUsers: (q) =>
    request(
      `/users?q=${encodeURIComponent(q)}`
    ),

  followUser: (id) =>
    request(`/users/${id}/follow`, {
      method: "POST",
    }),

  blockUser: (id) =>
    request(`/users/${id}/block`, {
      method: "POST",
    }),
};