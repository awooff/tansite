import React, { useState, useEffect } from "react";
import { Box, Text } from "@radix-ui/themes";

type Props = Record<string, unknown>;
const MusicPlayer: React.FC<Props> = () => {
	const [song, setSong] = useState("/audio/Surround.wav");
	const [playing, setPlaying] = useState(false);
	return (
		<Box width={"max-content"} className="bg-black w-72">
			<Text>MusicPlayer is {playing ? "" : "not"} playing!</Text>

			<audio
				onPlay={() => {
					setPlaying(true);
				}}
				onPause={() => {
					setPlaying(false);
				}}
				controls
				src={song}
			></audio>
		</Box>
	);
};

export default MusicPlayer;
