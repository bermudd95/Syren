// src/backend/models/GuardShift.js
import mongoose from "mongoose";

const GuardShiftSchema = new mongoose.Schema(
	{
		guardName: { type: String, required: true },
		phone: String,
		email: String,
		siteId: { type: String, required: true }, // string ID for site (could be ObjectId)
		checkInTime: { type: Date, default: Date.now },
		checkOutTime: Date,
		location: {
			lat: { type: Number, required: true },
			lng: { type: Number, required: true },
		},
		status: {
			type: String,
			enum: ["checked-in", "checked-out"],
			default: "checked-in",
		},
		priority: {
			type: String,
			enum: ["Low", "Medium", "High", "Critical"],
			default: "Low",
		},
		guardUid: String,
	},
	{ timestamps: true },
);

export default mongoose.model(
	"GuardShift",
	GuardShiftSchema,
);
