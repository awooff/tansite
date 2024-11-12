import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "@components/MusicPlayer";
import VideoLayout from "@layouts/VideoLayout";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

function Leaderboard() {
	const players = [
		{
			name: "xXX___l337h4x0r___XXx",
			bloods: 2173,
			money: 324094,
		},
		{
			name: "houslei",
			bloods: 1934,
			money: 4834,
		},
		{
			name: "geigei",
			bloods: 1844,
			money: 83842,
		},
	];
	return (
		<Table className="bg-gray-900 rounded-md">
			<TableHeader>
				{["Player", "Bloods", "$"].map((el, index) => (
					<TableHeader key={index}>{el}</TableHeader>
				))}
			</TableHeader>
			<TableBody>
				{Object.values(players).map((player, index) => (
					<TableRow key={index} className="text-white bg-gray-800">
						<TableHeader>{player.name}</TableHeader>
						<TableCell>{player.bloods}</TableCell>
						<TableCell>{player.money}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function HeroBanner() {
	const navigate = useNavigate();
	return (
		<article className="flex flex-col">
			<h1 className={"text-8xl w-full"}>The future is now.</h1>
			<p>Hack the world. Hack your dog. Welcome to Syscrack.</p>
			<section>
				<Button
					variant="secondary"
					content={"Log in"}
					onClick={() => {
						navigate("/user/login");
					}}
				>
					Log in
				</Button>
				<Button
					variant="ghost"
					color="green"
					content={"Sign Up"}
					onClick={() => {
						navigate("/user/register");
					}}
				>
					Sign Up
				</Button>
			</section>
		</article>
	);
}

type RootPageProps = Record<string, unknown>;
const RootPage: React.FC<RootPageProps> = () => (
	<Fragment>
		<div>
			<HeroBanner />
		</div>
		<div>
			<div className="grid grid-rows-3 text-white">
				<div>
					<h4>Leaderboard</h4>
					<Leaderboard />
				</div>

				<div>
					<MusicPlayer />
				</div>
			</div>
		</div>
	</Fragment>
);

export default RootPage;
