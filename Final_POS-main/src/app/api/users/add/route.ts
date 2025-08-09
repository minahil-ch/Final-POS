// app/api/users/add/route.ts

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, password, role } = body;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
  });

  return Response.json(user);
}
