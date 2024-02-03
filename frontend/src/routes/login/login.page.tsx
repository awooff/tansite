import React, {Fragment} from 'react';
import Form from './form';
import {Flex, Heading} from '@radix-ui/themes';

function LoginPage(): React.ReactElement {
	const session = useContext(SessionContext)
	const game = useContext(GameContext);
	const {
		register,
		handleSubmit,
	} = useForm<Inputs>()
	const navigate = useNavigate();
	const [error, setError] = useState<Error | null>(null);
	const onSubmit: SubmitHandler<Inputs> = async (inputs) => {
		await postRequestHandler<{
			token: string
		}>('/auth/login', inputs, (result) => {
			localStorage.setItem('jwt', result.data.token)
			session.load(() => {
				game.load(() => {
					navigate('/game')
				})
			});
		}, setError);
	}
	
	return (
		<Fragment>
			<Heading>Login</Heading>
			<Flex className='my-12 max-w-md align-center items-center justify-center'>
				<Form />
			</Flex>
		</Fragment>
	);
}

export default LoginPage;
