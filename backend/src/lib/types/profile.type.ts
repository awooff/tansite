export type ProfileData = {
  user?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
  };
  avatar?: {
    body?: string;
    hair?: string;
  };
  quest?: {
    current?: string;
  };
  tutorial?: false;
};
