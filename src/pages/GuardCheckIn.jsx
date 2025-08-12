import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo 1.png";
export default function CheckIn()  {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    guardName: "",
    phone: "",
    email: "",
    site: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, location, siteRoom: "SITE123" }),
      });

      setLoading(false);
      if (res.ok) {
        navigate("/dashboard");
      } else {
        console.error("Check-in failed");
      }
    });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-900">
      <div className="justify-center items-center pb-3">
        <img src={Logo} alt="Logo" className="h-40 w-auto rounded-lg" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-6 rounded-xl shadow-xl w-96"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Guard Check-In
        </h2>

        <input
          name="guardName"
          value={form.guardName}
          placeholder="Name"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          value={form.phone}
          placeholder="Phone"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          value={form.email}
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
          required
        />
        <input
          name="site"
          value={form.site}
          placeholder="Site"
          className="w-full p-2 mb-3 border rounded"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded disabled:opacity-60"
        >
          {loading ? "Checking in..." : "Check In"}
        </button>
      </form>
    </div>
  );
}