import Joi from "joi";

export const createChannelSchema = Joi.object({
  name: Joi.string().required(),
  isPrivate: Joi.boolean().required(),
});

export const sendMessageSchema = Joi.object({
  message: Joi.string().required(),
  channel_id: Joi.string().required(),
});
