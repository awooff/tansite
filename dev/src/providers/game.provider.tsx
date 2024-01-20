

import React, {ReactNode, useCallback, useEffect, useState} from 'react'
import GameContext, { GameContextDefault, GameType } from '../contexts/game.context'
import PropTypes from 'prop-types';
import axios from 'axios';
import { Computer } from '../lib/types/computer.type';

function GameProvider({ children }: {
	children: unknown
}) {
	const [game, setGame] = useState<GameType>(GameContextDefault)
	
	const load = useCallback((after?: (newGame: GameType) => void) => {				
		(async () => {
			let newGame = { ...GameContextDefault };

			if (game.loaded)
			{
				setGame(newGame)
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
					computers: Computer[],
					connections: Computer[]
				}>('http://localhost:1337/computers/network', {
					page: 0
				}, {
					withCredentials: true,
					headers: {
						Authorization: 'Bearing ' + localStorage.getItem('jwt')
					}
				})

				newGame = {
					...GameContextDefault,
					connections: computers.data.connections,
					computers: computers.data.computers,
					title: game.data.title,
					gameId: game.data.currentGameId,
					loaded: true,
					load: load
				}

				setGame(newGame)
							
				if (after)
					await after(newGame)
			} catch (error) {
				newGame = {
						...GameContextDefault,
						loaded: true,
						load: load
				}

				setGame(newGame)

				if (after)
					await after(newGame)
			}
		})();
	}, [
		setGame, game.loaded
	])

	useEffect(() => {
		if (game.loaded)
			return;
		load();
	}, [
		load, game
	])

	return <GameContext.Provider value={game}>
		{game.loaded ? children as ReactNode : <></>}
	</GameContext.Provider>
}

GameProvider.propTypes = {
	children: PropTypes.any
}

export default GameProvider