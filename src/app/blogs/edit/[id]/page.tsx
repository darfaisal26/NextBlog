import { getPostData } from "@/lib/api";
import EditPostClient from "@/app/components/EditPostClient";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  let postData;
  try {
    postData = await getPostData(id);
  } catch (error) {
    console.error("Error fetching post:", error);
    postData = { title: "", content: "" };
  }

  // Return the client component and pass the data as props
  return <EditPostClient id={id} initialPostData={postData} />;
}
