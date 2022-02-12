import { intArg, list, nonNull, objectType, stringArg } from "nexus";
import { extendType } from "nexus";


export const Post = objectType({
  name: "Post", // <- Name of your type
  definition(t) {
    t.int("id"); // <- Field named `id` of type `Int`
    t.string("title"); // <- Field named `title` of type `String`
    t.string("body"); // <- Field named `body` of type `String`
    t.boolean("published"); // <- Field named `published` of type `Boolean`
  },
});

export const PostQuery = extendType({
  type: "Query", // 2
  definition(t) {
    t.field("drafts", {
      type: nonNull(list("Post")),
      resolve(_root, _args, ctx) {
        // 1
         return ctx.db.post.findMany({ where: { published: false } });
      },
    });
    t.list.field("posts", {
      type: "Post",
      authorize: (root, args, ctx) => ctx.auth.canViewPost(),
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: true } });
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createDraft", {
      type: "Post",
      args: {
        // 1
        title: nonNull(stringArg()), // 2
        body: nonNull(stringArg()), // 2
      },
      resolve(_root, args, ctx) {
        const draft = {
          title: args.title, // 3
          body: args.body, // 3
          published: false,
        };
        return ctx.db.post.create({ data: draft });
      },
    });
    t.field("publish", {
      type: "Post",
      args: {
        draftId: nonNull(intArg()),
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.update({
          where: { id: args.draftId },
          data: {
            published: true,
          },
        });
      },
    });
  },
});
