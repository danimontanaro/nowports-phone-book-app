import type { NextApiRequest, NextApiResponse } from "next";
import { Contact, PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export interface ContactsResponse {
  data?: Omit<Contact, "user" | "userId">[] | Contact;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ContactsResponse>
) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401);
  }
  if (req.method === "POST") {
    const newContact = JSON.parse(req.body);
    const { firstName, lastName, phone, userId, id } = newContact;
    const saveContact = await prisma.contact.upsert({
      where: {
        id: parseInt(id) || -1,
      },
      update: {
        firstName: !!firstName ? firstName : undefined,
        lastName: !!lastName ? lastName : undefined,
        phone: !!phone ? parseInt(phone) : undefined,
        userId: !!userId ? userId : undefined,
      },
      create: {
        firstName,
        lastName,
        phone: parseInt(phone),
        userId,
      },
    });
    res.status(200).json({ data: saveContact });
    return;
  } else if (req.method === "GET") {
    const { userId } = req.query;
    const id = parseInt(userId as string);

    const foundContacts = await prisma.contact.findMany({
      where: {
        userId: id || -1,
      },
      select: {
        firstName: true,
        lastName: true,
        phone: true,
        id: true,
      },
    });

    res
      .status(200)
      .json({
        data: foundContacts.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        ),
      });
    return;
  } else if (req.method === "DELETE") {
    const contactId = JSON.parse(req.body);
    const deleteContact = await prisma.contact.delete({
      where: {
        id: contactId as number,
      },
    });

    res.status(200).json({ data: deleteContact });
    return;
  }
  return res.status(405);
};
