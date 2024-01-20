import React, { useContext } from 'react'
import SessionContext from '../contexts/session.context'

export default function Gamebar() {
	const provider = useContext(SessionContext)
	
	return (
		<div>Gamebar</div>
	)
}
