import type React from "react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import MusicPlayer from "@components/MusicPlayer";
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

function HeroBanner() {
	const navigate = useNavigate();
	return (
		<section className="flex flex-col">
			<h1 className={"text-8xl w-full"}>XLVII</h1>
			<p>Hack the world. Hack your dog. Welcome to Syscrack.</p>
			<section className='flex gap-4 p-4'>
				<Button
					content={"Log in"}
					onClick={() => {
						navigate("/user/login");
					}}
				>
					Log in
				</Button>
				<Button
					content={"Sign Up"}
					onClick={() => {
						navigate("/user/register");
					}}
				>
					Sign Up
				</Button>
			</section>
		</section>
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
					<MusicPlayer />
				</div>
			</div>
		</div>
	</Fragment>
);

export default RootPage;
