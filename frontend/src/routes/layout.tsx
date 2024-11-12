import React, { type ReactNode, type ReactElement } from "react";
import Navbar from "@components/Navbar";
import { SidebarProvider } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { Menubar } from "@/components/ui/MenuBar";

export function Layout(props: { children?: ReactNode }): ReactElement {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex flex-col w-full">
				<Navbar />
				<div className="w-full md:w-4/5 p-4 md:p-0 mx-auto">
					{props.children}
					<Menubar />
				</div>
			</main>
		</SidebarProvider>
	);
}

export default Layout;
