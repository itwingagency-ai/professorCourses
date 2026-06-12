import { Model } from "mongoose";

export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const generateUniqueSlug = async (
  name: string,
  model: Model<any>
): Promise<string> => {
  const baseSlug = slugify(name) || "course";
  let slug = baseSlug;
  let counter = 1;

  while (await model.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
