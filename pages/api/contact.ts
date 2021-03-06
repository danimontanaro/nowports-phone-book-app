import type { NextApiRequest, NextApiResponse } from "next";
import { Contact, PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse<Contact>) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(405);
  }
  if (req.method === "GET") {
    const { id } = req.query;
    const contact = await prisma.contact.findUnique({
      where: {
        id: parseInt(id as string),
      },
    });
    res.status(202).json(contact);
    return;
  }
  return res.status(404);
};
