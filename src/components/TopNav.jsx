import { useState, useRef, useEffect } from "react";

export default function TopNav() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setIsOpen((prev) => !prev);
	};

	const handleClickOutside = (e) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(e.target)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener(
			"mousedown",
			handleClickOutside,
		);
		return () =>
			document.removeEventListener(
				"mousedown",
				handleClickOutside,
			);
	}, []);

	return (
		<header className="bg-[#1F2D3D] text-white px-6 py-4 flex items-center justify-between relative w-full max-w-full overflow-x-hidden">
			<div className="flex items-center gap-4">
				<h1 className="text-2xl font-semibold">
					Syren
				</h1>
			</div>

			<div className="relative">
				<button
					onClick={toggleDropdown}
					className="text-white focus:outline-none text-2xl"
				>
					☰
				</button>

				{/* Dropdown Menu */}
				<div
					ref={dropdownRef}
					className={`fixed top-16 right-0 z-50 w-56 bg-white text-black shadow-md rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out
            ${
				isOpen
					? "translate-x-0 opacity-100 pointer-events-auto"
					: "translate-x-full opacity-0 pointer-events-none"
			}
          `}
				>
					<ul className="divide-y divide-gray-200">
						<li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
							Dashboard
						</li>
						<li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
							Settings
						</li>
						<li className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
							Log Out
						</li>
					</ul>
				</div>
			</div>
		</header>
	);
}
