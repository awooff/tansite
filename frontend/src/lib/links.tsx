import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";

export const createLinks = (
	links: Record<
		string,
		{
			element?: null | any;
			to?: string;
			capitalize?: boolean;
			state?: object;
			className?: string;
		}
	>,
) => {
	const components: ReactNode[] = [];

	for (const link of Object.keys(links)) {
		const Element = links[link].element;

		if (!links[link].to) links[link].to = `/${link}`;

		components.push(
			<Element>
				<Link
					to={links[link].to as string}
					state={links[link].state ? links[link].state : {}}
					className={links[link].className}
				>
					{links[link].capitalize
						? link.substring(0, 1).toUpperCase() + link.slice(1)
						: link}
				</Link>
			</Element>,
		);
	}

	return components;
};
