import T, { ModelType } from 'tsplate';

export const TCreateMessage = T.Object({
    userId: T.Int,
    channelId: T.Int,
    body: T.String,
    timeSent: T.Date
});
export type CreateMessage = ModelType<typeof TCreateMessage>;
export const createMessage = 'create-message';