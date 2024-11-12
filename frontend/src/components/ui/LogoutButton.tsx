import type React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userStore } from "@stores/user.store";
import { Button } from "@ui/Button";

type Props = Record<string, unknown>;
const LogoutButton: React.FC<Props> = () => {
	const user = userStore((store) => store.user);
	const navigate = useNavigate();

	return (
		<Button
			onClick={async () => {
				await axios
					.post(
						"http://localhost:1337/auth/logout",
						{},
						{
							withCredentials: true,
							headers: {
								Authorization: `Bearer ${user.jwt}`,
							},
						},
					)
					.catch((err) => {
						throw new Error(String(err));
					})
					.then(() => {
						userStore.persist.clearStorage();
						navigate("/");
						window.location.reload();
					});
			}}
		>
			Logout
		</Button>
	);
};

export default LogoutButton;
