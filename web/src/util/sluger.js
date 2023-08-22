export function maker(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export const checker = new RegExp("^[a-z0-9]+(?:-[a-z0-9]+)*$");

export const getFileName = (value) => {
  const fileExt = value.split(".").pop();
  const fileName = maker(value.split(".").slice(0, -1).join("."));
  return `${fileName}.${fileExt}`;
};


export function getInitials(input) {
  const words = input?.split(" "); // Split input into words
  let initials = "";

  for (const word of words) {
      initials += word[0]; // Add the first character of each word to initials
  }

  return initials.toUpperCase();
}