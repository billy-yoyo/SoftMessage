import T, { ModelType } from 'tsplate';

export const TUserJoin = T.Object({
    userId: T.Int,
    channelId: T.Int
});
export type UserJoin = ModelType<typeof TUserJoin>;
export const userJoin = 'user-join';