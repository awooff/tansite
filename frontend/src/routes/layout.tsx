import Taskbar from "@components/Taskbar";
import React, { type ReactNode, type ReactElement } from "react";
import Navbar from "@components/Navbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export function Layout(props: { children?: ReactNode }): ReactElement {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex flex-col">
				<Navbar />
				<div className="max-w-full">{props.children}</div>
				<Taskbar />
			</main>
		</SidebarProvider>
	);
}

export default Layout;
