import React, { Fragment, useRef } from "react";
import { userStore } from "@stores/user.store";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/Sidebar";
import { Link } from "react-router-dom";

function Navbar() {
	const user = userStore((store) => store.user);

	return (
		<nav className="sticky top-0 z-50 py-8 bg-slate-950 text-white">
			<div className="flex flex-row gap-4 justify-between my-auto">
				<SidebarTrigger />
				<div id="index" className="flex flex-row  items-center gap-4">
					<h1 className="text-6xl text-pink-700">XLVII</h1>
					<img src="" alt="tan" className="max-w-16 object-contain" />
				</div>
				<hr />
				<div className="flex flex-row gap-4 items-center">
					<Link to="/about">About</Link>
					<Link to="/art">Art</Link>
					<Link to="/store">Store</Link>
					<Link to="/portfolio">Portfolio</Link>
				</div>
				<div className="flex flex-row my-auto">
					Welcome, {user.username || " user"}
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
