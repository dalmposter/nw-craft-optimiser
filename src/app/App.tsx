import React, { useState } from 'react';
import './App.scss';
import CraftCalc from './craftCalc/CraftCalc';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Roadmap from './roadmap/Roadmap';
import Footer from './components/footer/Footer';

function App() {

	const [page, setPage] = useState("calculator");

	return (
		<div className="App">
			<div id="page-wrapper">
				<div id="panel-wrapper">
					{ page === "calculator" && <CraftCalc /> }
					{ page === "roadmap" && <Roadmap />}
					<Footer setPage={setPage} />
				</div>
			</div>
		</div>
	);
}

export default App;
