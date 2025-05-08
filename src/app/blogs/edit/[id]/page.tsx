import EditPostClient from "@/app/components/EditPostClient";


export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditPostClient id={id} />;
}