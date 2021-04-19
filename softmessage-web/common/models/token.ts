import T, { ModelType } from "tsplate";

export const TToken = T.Object({ token: T.String, userId: T.Int });
export type Token = ModelType<typeof TToken>;
