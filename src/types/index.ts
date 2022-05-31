import { Contact } from "@prisma/client";

export interface ContactForm {
  firstName: string;
  lastName: string;
  phone: number;
  userId: number;
}
