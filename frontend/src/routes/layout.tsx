import React, { type ReactNode, type ReactElement } from "react";
import Navbar from "@components/Navbar";
import { SidebarProvider } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { Menubar } from "@/components/ui/MenuBar";

export function Layout(props: { children?: ReactNode }): ReactElement {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex flex-col">
				<Navbar />
				<div className="max-w-full">{props.children}</div>
				<Menubar />
			</main>
		</SidebarProvider>
	);
}

export default Layout;
