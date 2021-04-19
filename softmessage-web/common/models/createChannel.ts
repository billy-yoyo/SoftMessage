import T, { ModelType } from 'tsplate';

export const TCreateChannel = T.Object({ channelName: T.String });
export type CreateChannel = ModelType<typeof TCreateChannel>;
