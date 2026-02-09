export const NEWS_CREATOR_ROLES = ["admin"] as const;

export type NewsCreatorRole = (typeof NEWS_CREATOR_ROLES)[number];
