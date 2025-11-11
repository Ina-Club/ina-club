/**
 * Generates avatar initials from a user's name
 * Takes the first letter of the first name and first letter of the last name
 * If only one word, takes the first two letters
 */
export function getAvatarInitials(name: string | null | undefined): string {
  if (!name || name.trim() === "") {
    return "?";
  }

  const trimmedName = name.trim();
  const words = trimmedName.split(/\s+/).filter((word) => word.length > 0);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    // Single word: take first two letters
    const word = words[0];
    if (word.length >= 2) {
      return word.substring(0, 2).toUpperCase();
    }
    return word.charAt(0).toUpperCase();
  }

  // Multiple words: take first letter of first word and first letter of last word
  const firstInitial = words[0].charAt(0).toUpperCase();
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

