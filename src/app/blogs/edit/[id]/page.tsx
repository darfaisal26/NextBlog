import EditPostClient from "@/app/components/EditPostClient";
import { getPostData } from "@/lib/api";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let postData;
  try {
    postData = await getPostData(id);
  } catch (error) {
    console.error("Error fetching post:", error);
    postData = { title: "", content: "" };
  }

  return <EditPostClient id={id} initialPostData={postData} />;
}
