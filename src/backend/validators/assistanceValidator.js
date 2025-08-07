import Joi from "joi";

export const assistanceSchema = Joi.object({
	name: Joi.string().min(2).max(200).required(),
	date: Joi.string()
		.isoDate()
		.required()
		.messages({
			"string.isoDate":
				"Date must be in ISO format (YYYY-MM-DD)",
		}),
	email: Joi.string().email().allow("", null),
	phone: Joi.string().allow("", null),
	location: Joi.string().allow("", null),
	reason: Joi.string().min(6).max(2000).required(),
});
