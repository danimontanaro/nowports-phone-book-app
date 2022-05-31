import { ContactsResponse } from "../../pages/api/contacts";

const URL = "/api/contacts";

export const getContacts = async (
  userId: string
): Promise<ContactsResponse> => {
  const response = await fetch(`${URL}?userId=${userId}`);
  const contacts = await response.json();
  return contacts;
};
