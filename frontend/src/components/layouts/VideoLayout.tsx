import React from 'react';

type VideoLayoutProps = {
	children: React.ReactNode;
	videoSrc: string;
};

export const VideoLayout: React.FC<VideoLayoutProps> = props => (
	<div className='relative flex h-screen mb-12 overflow-hidden'>
		<div className='relative z-30 p-12 text-2xl text-white bg-opacity-50 rounded-xl'>
			{props.children}

		</div>
		<video
			id='background-video'
			className='brightness-[.3] absolute z-10 w-auto min-w-full min-h-full max-w-none'
			loop muted autoPlay>
			<source src={props.videoSrc} type='video/mp4' />
			Your browser does not support the video tag.
		</video>
	</div>
);

export default VideoLayout;
