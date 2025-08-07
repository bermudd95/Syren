import mongoose from "mongoose";

const assistanceSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		date: { type: String, required: true }, // yyyy-mm-dd
		email: String,
		phone: String,
		location: String,
		reason: { type: String, required: true },
		firebaseUid: String,
		status: {
			type: String,
			enum: ["new", "in_progress", "resolved"],
			default: "new",
		},
		notes: String,
		assignedTo: String,
	},
	{ timestamps: true },
);

export default mongoose.model(
	"AssistanceRequest",
	assistanceSchema,
);
