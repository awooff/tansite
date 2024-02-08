import { Route } from "../../lib/types/route.type";
import { server } from "../../index";
import { Groups } from "@prisma/client";
import { removeFromObject } from "@/lib/helpers";

const valid = {
  settings: {
    groupOnly: Groups.User,
    title: "Valid",
    description: "check if the user is logged in",
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
        creation: true,
      },
    });

    if (!req.session.logins) req.session.logins = {};
    if (!req.session.connections) req.session.connections = [];

    res.send({
      user,
      session: req.session,
    });
  },
} satisfies Route;

export default valid;
