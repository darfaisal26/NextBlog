// src/lib/api.ts (or wherever you keep your API functions)

import axios from "./axios"; // Adjust this according to your project structure

export const getPostData = async (id: string) => {
  try {
    const response = await axios.get(`/blogs/${id}`);
    return response.data;  
  } catch (error) {
    throw new Error("Failed to fetch post data.");
  }
};
