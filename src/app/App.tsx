import React from 'react';
import './App.scss';
import CraftCalc from './craftCalc/CraftCalc';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/footer/Footer';

function App() {

	return (
		<div className="App">
			<div id="page-wrapper">
				<BrowserRouter basename='/nw-craft-optimiser'>
					<Routes>
						<Route path='/' element={<CraftCalc />} />
					</Routes>
				</BrowserRouter>
				<Footer />
			</div>
		</div>
	);
}

export default App;
