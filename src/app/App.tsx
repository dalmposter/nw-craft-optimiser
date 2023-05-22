import React from 'react';
import './App.scss';
import CraftCalc from './craftCalc/CraftCalc';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Roadmap from './roadmap/Roadmap';

function App() {

	return (
		<div className="App">
			<div id="page-wrapper">
				<BrowserRouter basename='/nw-craft-optimiser'>
					<Routes>
						<Route path='/' element={<CraftCalc />} />
					</Routes>
				</BrowserRouter>
			</div>
		</div>
	);
}

export default App;
