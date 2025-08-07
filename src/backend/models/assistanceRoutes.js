import mongoose from "mongoose";

const AssistanceRequestSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: String,
	phone: String,
	location: String,
	reason: { type: String, required: true },
	priority: {
		type: String,
		enum: ["Low", "Medium", "High", "Critical"],
		required: true,
	},
	date: { type: String, required: true },
	userId: { type: String, required: true }, // Firebase UID
	createdAt: { type: Date, default: Date.now },
});

export default mongoose.model(
	"AssistanceRequest",
	AssistanceRequestSchema,
);
