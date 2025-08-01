import { useState } from "react";
import cam1 from "../assets/cameraViews/alan-j-hendry-KNt4zd8HPb0-unsplash.jpg";
import cam2 from "../assets/cameraViews/arno-senoner-42t-DKecmPk-unsplash.jpg";
import cam3 from "../assets/cameraViews/ennio-dybeli-KDdNjUQwzSw-unsplash.jpg";
import cam4 from "../assets/cameraViews/michal-jakubowski-oQD9uq4Rd4I-unsplash.jpg";
import cam5 from "../assets/cameraViews/possessed-photography-n56WptG3O9M-unsplash.jpg";
import cam6 from "../assets/cameraViews/waldemar-Bwp3FBEGSHQ-unsplash.jpg";

const cameraFeeds = [
	{
		id: 1,
		label: "Cam 1",
		src: cam1,
	},
	{
		id: 2,
		label: "Cam 2",
		src: cam2,
	},
	{
		id: 3,
		label: "Cam 3",
		src: cam3,
	},
	{
		id: 4,
		label: "Cam 4",
		src: cam4,
	},
	{
		id: 5,
		label: "Cam 5",
		src: cam5,
	},
	{
		id: 6,
		label: "Cam 6",
		src: cam6,
	},
];

function VideoPreview() {
	const [selectedFeed, setSelectedFeed] = useState(null);

	return (
		<div className="rounded-2xl backdrop-blur-md bg-slate-900/30 border border-slate-700 shadow-lg p-4 text-white">
			<div className=" h-[400px] overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-600">
				<div className="grid grid-cols-2 gap-3">
					{cameraFeeds.map((cam) => (
						<div
							key={cam.id}
							onClick={() =>
								setSelectedFeed(cam)
							}
							className="min-w-[150px] cursor-pointer rounded-lg overflow-hidden shadow-md hover:scale-105 transition "
						>
							<img
								src={cam.src}
								alt={cam.label}
								className="w-full h-28 object-cover"
							/>
							<p className="text-center text-sm bg-slate-800/70 py-1">
								{cam.label}
							</p>
						</div>
					))}
				</div>

				{/* Modal */}
				{selectedFeed && (
					<div
						className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
						onClick={() =>
							setSelectedFeed(null)
						}
					>
						<div
							className="bg-slate-900/90 rounded-xl p-4 max-w-xl w-full shadow-xl border border-white/10"
							onClick={(e) =>
								e.stopPropagation()
							}
						>
							<div className="flex justify-between items-center mb-2">
								<h3 className="text-white text-lg">
									{selectedFeed.label}
								</h3>
								<button
									onClick={() =>
										setSelectedFeed(
											null,
										)
									}
									className="text-white hover:text-red-400"
								>
									✖
								</button>
							</div>
							<img
								src={selectedFeed.src}
								alt={selectedFeed.label}
								className="w-full h-96 object-contain rounded-md"
							/>
						</div>
					</div>
				)}
			</div>
			<button
				className="bg-red-600 hover:bg-red-700 text-white font-semibold mt-2 w-full py-2 rounded-md transition"
				style={{ backgroundColor: "#e63946" }}
			>
				Request Guard Assistance
			</button>
		</div>
	);
}

export default VideoPreview;
