import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

    export async function GET(
      req: Request,
      {
        params,
      }: {
        params: Promise<{ id: string }>;
      }
    ) {
      const { id } = await params;
      try {
        const post = await prisma.post.findUnique({
          where: {
            id: parseInt(id),
          },
        });

        console.log("Post fetched:", post);

        if (!post) {
          return new Response("Post not found", { status: 404 });
        }
        return new Response(JSON.stringify(post), { status: 200 });
      } catch (error) {
        console.error(error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }
