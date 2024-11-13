import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/Sidebar";

// Menu items.
const items = [
	{
		year: 2021,
		path: '/2021',
	},
	{
		year: 2022,
		path: '/2022'
	}
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<div className='flex flex-col gap-2 text-center'>
							<h1 className="text-8xl text-pink-400">ART</h1>
							<p>THINGS I HAVE DONE</p>
							{items.map((item) => (
								<SidebarMenuItem key={item.year}>
									<SidebarMenuButton asChild>
										<a className="text-center" href={item.path}>
											{item.year}	
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							</div>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
