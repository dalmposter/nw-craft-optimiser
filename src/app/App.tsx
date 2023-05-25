import React, { useState } from 'react';
import './App.scss';
import CraftCalc from './craftCalc/CraftCalc';
import Roadmap from './roadmap/Roadmap';
import Footer from './components/footer/Footer';
import SettingsPage from './settingsPage/SettingsPage';

function App() {

	const [page, setPage] = useState("calculator");

	return (
		<div className="App">
			<div id="page-wrapper">
				<div id="panel-wrapper">
					{ page === "calculator" && <CraftCalc /> }
					{ page === "roadmap" && <Roadmap /> }
					{ page === "settings" && <SettingsPage /> }
					<Footer setPage={setPage} />
				</div>
			</div>
		</div>
	);
}

export default App;
