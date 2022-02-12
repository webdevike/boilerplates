import { context } from "../context";

export const canViewPost = async (id: number): Promise<boolean> => {
  const post = await context.db.post.findUnique({
    where: { id },
  });
  if (post?.published === true) {
    return true;
  }
  return false;
};
