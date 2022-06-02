import type { NextApiRequest, NextApiResponse } from "next";
import { Contact, PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import { transpileModule } from "typescript";

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
    return res.status(405);
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
    res.status(202).json({ data: saveContact });
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
        addressLines: true,
      },
    });

    res.status(200).json({
      data: foundContacts.sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      ),
    });
    return;
  } else if (req.method === "DELETE") {
    const contactId = JSON.parse(req.body);
    const contact = await prisma.contact.findUnique({
      where: {
        id: parseInt(contactId as string),
      },
    });
    if (!contact) {
      res.status(404);
      return;
    }
    const deletedContact = await prisma.contact.delete({
      where: {
        id: contactId,
      },
    });
    res.status(204).json({ data: deletedContact });
    return;
  }
  return res.status(404);
};
