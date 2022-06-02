import type { NextApiRequest, NextApiResponse } from "next";
import { Contact, PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse<Contact>) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401);
  }
  if (req.method === "GET") {
    const { id } = req.query;
    const contact = await prisma.contact.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).json(contact);
    return;
  }
  return res.status(405);
};
