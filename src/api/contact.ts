import { Contact } from "@prisma/client";

/* export type DeleteContact = {
  id?: number;
  lastName?: string;
  firstName?: string;
  phone?: number;
}; */
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
