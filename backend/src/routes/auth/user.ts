import { Route } from "../../lib/types/route.type";
import { server } from "../../index";
import { Groups } from "@prisma/client";
import { removeFromObject } from "@/lib/helpers";

const user = {
  settings: {
    groupOnly: Groups.User,
    title: "Return the user",
    description: "returns the current user",
  },

  async get(req, res, error) {
    const user = await server.prisma.user.findFirstOrThrow({
      where: {
        id: req.session.userId,
      },
      select: {
        name: true,
        email: true,
        group: true,
        id: true,
        created: true,
      },
    });
    res.send({
      user,
    });
  },
} satisfies Route;

export default user;
