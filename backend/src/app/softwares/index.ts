import generic from "./generic";
import collector from "./collector";
import cracker from "./cracker";
import hasher from "./hasher";
import spammer from "./spammer";
import ftpr from "./ftpr";
import firewall from "./firewall";
import scam from "./scam";
import warez from "./warez";

const index = {
  generic,
  collector,
  cracker,
  hasher,
  spammer,
  ftpr,
  firewall,
  scam,
  warez,
};
export type SoftwareType = keyof typeof index;

export default { ...index };
