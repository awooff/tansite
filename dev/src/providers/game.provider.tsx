

import React, {ReactNode, useCallback, useContext, useEffect, useState} from 'react'
import GameContext, { GameContextDefault, GameType } from '../contexts/game.context'
import PropTypes from 'prop-types';
import SessionContext from '../contexts/session.context';
import axios from 'axios';
import { Computer } from '../lib/types/computer.type';
import { useNavigate } from 'react-router-dom';

function GameProvider({ children }: {
	children: unknown
}) {
	const session = useContext(SessionContext)
	const [game, setGame] = useState<GameType>(GameContextDefault)
	const navigate = useNavigate()
	
	const load = useCallback((after?: () => void) => {				
		(async () => {
			if (game.loaded) {
				setGame(
				{
					...GameContextDefault,
					loaded: false,
					load: load,
					reload: () => {
							navigate(0)
						}
					}
				)
				return;
			}
			

			try
			{
				const game = await axios.get<{
					title: string,
					currentGameId: string
				}>('http://localhost:1337/', {
					withCredentials: true,
					headers: {
						Authorization: 'Bearing ' + localStorage.getItem('jwt')
					}
				})

				const computers = await axios.post<{
					computers: Computer[]
				}>('http://localhost:1337/computers/network', {
					page: 0
				}, {
					withCredentials: true,
					headers: {
						Authorization: 'Bearing ' + localStorage.getItem('jwt')
					}
				})

				setGame({
					...GameContextDefault,
					connections: session.data.connections,
					computers: computers.data.computers,
					title: game.data.title,
					gameId: game.data.currentGameId,
					loaded: true,
					load: load,
					reload: () => {
						navigate(0)
					}
				})
			} catch (error) {
				setGame(
					{
						...GameContextDefault,
						loaded: true,
						load: load,
						reload: () => {
							navigate(0)
						}
					}
				)
			}

			if (after)
				await after()
		})();
	}, [
		setGame, session, navigate, game.loaded
	])

	useEffect(() => {
		if (game.loaded)
			return;

		if (!session.loaded)
			return;

		if (!session.valid)
			setGame(
					{
						...GameContextDefault,
						loaded: true,
						load: load
					}
			)
		else
			load();
	}, [
		load, game, session
	])

	return <GameContext.Provider value={game}>
		{children as ReactNode }
	</GameContext.Provider>
}

GameProvider.propTypes = {
	children: PropTypes.any
}

export default GameProvider