import { Route } from "../../lib/types/route.type";
import { Groups, Prisma } from "@/db/client";
import { getComputer } from "@/app/computer";
import { computerIdSchema } from "@/lib/schemas/computer.schema";
import { removeFromObject } from "@/lib/helpers";

const connect = {
  settings: {
    groupOnly: Groups.User,
    title: "Connect To Local Computer",
    description: "Switch current computer to another computer",
  },

  async post(req, res, error) {
    const body = await computerIdSchema.safeParseAsync(req.body);

    if (!body.success) return error(body.error);

    const { computerId } = body.data;
    const computer = await getComputer(computerId);

    if (!computer?.computer) {
      return error("invalid computer");
    }
    if (computer?.computer?.userId !== req.session.userId) {
      return error("user does not own this computer");
    }

    if (
      req.session?.connections &&
      req.session?.connections?.filter(
        (that) => that.id === computer.computerId,
      ).length !== 0
    )
      return error("already connected to this computer");

    req.session.connections = req.session.connections || [];
    req.session.connections.push(
      removeFromObject(computer.computer, ["software", "process"]),
    );

    // logged new login
    computer.log(`logged on at ${new Date(Date.now()).toString()}`);

    res.send({
      computer: computer.computer,
    });
  },
} as Route;

export type ReturnType = {
  computer: Prisma.ComputerGetPayload<{
    include: {
      Logs: true;
      process: true;
      software: true;
      hardware: true;
    };
  }>;
};

export default connect;
