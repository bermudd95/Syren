import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function AdminRequestView() {
	const { id } = useParams();
	const [request, setRequest] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const auth = getAuth();
			const user = auth.currentUser;
			if (!user) {
				navigate("/login");
				return;
			}
			const idTokenResult =
				await user.getIdTokenResult();
			if (!idTokenResult.claims?.admin) {
				alert("Admin access required");
				navigate("/");
				return;
			}
			const token = await user.getIdToken();
			const res = await fetch(
				`/api/admin/requests/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			const data = await res.json();
			setRequest(data.request);
			setLoading(false);
		})();
	}, [id, navigate]);

	if (loading) return <div>Loading...</div>;
	if (!request) return <div>Not found</div>;

	const handleUpdate = async (patch) => {
		const token =
			await getAuth().currentUser.getIdToken();
		await fetch(`/api/admin/requests/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(patch),
		});
		// refresh
		const res = await fetch(
			`/api/admin/requests/${id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		const data = await res.json();
		setRequest(data.request);
	};

	return (
		<div className="p-6">
			<h1 className="text-xl font-bold mb-4">
				Request {request._id}
			</h1>
			<p>
				<strong>Name:</strong> {request.name}
			</p>
			<p>
				<strong>Date:</strong> {request.date}
			</p>
			<p>
				<strong>Contact:</strong> {request.email} /{" "}
				{request.phone}
			</p>
			<p>
				<strong>Location:</strong>{" "}
				{request.location}
			</p>
			<p>
				<strong>Reason:</strong> {request.reason}
			</p>
			<p>
				<strong>Status:</strong> {request.status}
			</p>

			<div className="mt-4">
				<button
					onClick={() =>
						handleUpdate({
							status: "in_progress",
						})
					}
					className="mr-2 px-3 py-1 bg-yellow-400 rounded"
				>
					Mark In Progress
				</button>
				<button
					onClick={() =>
						handleUpdate({ status: "resolved" })
					}
					className="px-3 py-1 bg-green-500 text-white rounded"
				>
					Resolve
				</button>
			</div>
		</div>
	);
}
