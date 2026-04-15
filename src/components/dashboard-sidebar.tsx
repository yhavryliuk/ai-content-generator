"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
	title: string;
	href: string;
	icon: React.ComponentType;
};
export type UserInfo = {
	email: string;
	plan: "FREE" | "PRO";
	postCount: number;
};

interface DashboardSidebarProps {
	navItems: NavItem[];
	user: UserInfo;
	freePostLimit: number;
}

export function DashboardSidebar({ navItems, user, freePostLimit }: DashboardSidebarProps) {

	const pathname = usePathname();
	const router = useRouter();

	const handleSignOut = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/login");
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-1">
					<Sparkles className="size-5 text-primary" />
					<Link href="/" className="text-lg font-semibold">AI Content Gen</Link>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton
										render={<Link href={item.href} />}
										isActive={pathname === item.href}
									>
										<item.icon />
										<span>{item.title}</span>
									</SidebarMenuButton>
									{item.title === "History" && (
										<SidebarMenuBadge>{user.postCount}</SidebarMenuBadge>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex flex-col gap-3 px-2">
					<div className="flex items-center justify-between">
						<Badge variant={user.plan === "PRO" ? "default" : "secondary"}>
							{user.plan}
						</Badge>
						{user.plan === "FREE" && (
							<span className="text-xs text-muted-foreground">
								{user.postCount}/{freePostLimit} posts
							</span>
						)}
					</div>
					<Separator />
					<div className="flex items-center gap-2">
						<Avatar className="size-8">
							<AvatarFallback>
								{user.email.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-1 flex-col overflow-hidden">
							<span className="truncate text-sm">{user.email}</span>
						</div>
						<button
							onClick={handleSignOut}
							className="text-muted-foreground hover:text-foreground cursor-pointer"
							aria-label="Sign out"
						>
							<LogOut className="size-4" />
						</button>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
