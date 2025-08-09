// app/api/branch/add/route.ts (or inside an action)

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, address } = body;

  const newBranch = await prisma.branch.create({
    data: {
      name,
      address,
    },
  });

  return Response.json(newBranch);
}
