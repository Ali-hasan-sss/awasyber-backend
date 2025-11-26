import { customAlphabet } from "nanoid";

const digits = "0123456789";
const nanoid = customAlphabet(digits, 6);

export const generateLoginCode = (): string => {
  const numbers = nanoid(); // Generate 6 random digits
  return `awa${numbers}`; // Format: awa + 6 digits (e.g., awa123456)
};
