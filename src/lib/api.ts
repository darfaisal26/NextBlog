import axios from "./axios";

export const getPostData = async (id: string) => {
  try {
    const response = await axios.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch post data.");
  }
};

export const deletePost = async (id: number, token: string) => {
  try {
    const response = await axios.delete(`/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Failed to delete the post.");
  }
};

export const updatePost = async (
  id: string | number,
  post: any,
  token: string
) => {
  try {
    const response = await axios.put(`/blogs/${id}`, post, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Failed to update post.");
  }
};

export const createBlogPost = async (title: string, content: string, token: string) => {
  try {
    const response = await axios.post(
      "/createblog",
      { title, content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    throw new Error("Error creating post.");
  }
};
