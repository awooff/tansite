import action from "./action";
import hack from "./hack";
import exploit from "./exploit";
import modify from "./log/modify";
import wipe from "./log/wipe";
import login from "./login";
import logout from "./logout";

const index = { action, hack, exploit, modify, wipe, login, logout };
export type ProcessTypes = keyof typeof index;

export default {
  ...index,
};
