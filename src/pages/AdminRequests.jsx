import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function AdminRequests() {
	const [requests, setRequests] = useState([]);
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
			const idToken = await user.getIdToken();
			const res = await fetch(`/api/admin/requests`, {
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			});
			const data = await res.json();
			setRequests(data.requests || []);
			setLoading(false);
		})();
	}, [navigate]);

	if (loading) return <div>Loading...</div>;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">
				Assistance Requests
			</h1>
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="px-4 py-2">Date</th>
						<th className="px-4 py-2">Name</th>
						<th className="px-4 py-2">
							Contact
						</th>
						<th className="px-4 py-2">
							Location
						</th>
						<th className="px-4 py-2">
							Reason
						</th>
						<th className="px-4 py-2">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					{requests.map((r) => (
						<tr
							key={r._id}
							className="border-t"
						>
							<td className="px-4 py-2">
								{new Date(
									r.createdAt,
								).toLocaleString()}
							</td>
							<td className="px-4 py-2">
								{r.name}
							</td>
							<td className="px-4 py-2">
								{r.email || r.phone}
							</td>
							<td className="px-4 py-2">
								{r.location}
							</td>
							<td className="px-4 py-2">
								{r.reason.slice(0, 80)}
								{r.reason.length > 80
									? "..."
									: ""}
							</td>
							<td className="px-4 py-2">
								<Link
									to={`/admin/requests/${r._id}`}
									className="mr-2 text-blue-600"
								>
									View
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
