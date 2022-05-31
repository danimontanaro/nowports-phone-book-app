import { Contact } from "@prisma/client";

const URL = "/api/contacts";

export const createOrUpdateContact = (
  contact: Omit<Contact, "user">,
  userId: string
) =>
  fetch(URL, {
    method: "POST",
    body: JSON.stringify({ ...contact, userId }),
  });

export const deleteContact = (contactId: number) =>
  fetch(URL, {
    method: "DELETE",
    body: JSON.stringify(contactId),
  });
