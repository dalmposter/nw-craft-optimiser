import React, { useState } from 'react';
import './App.scss';
import CraftCalc from './craftCalc/CraftCalc';
import Roadmap from './roadmap/Roadmap';
import Footer from './components/footer/Footer';
import SettingsPage from './settingsPage/SettingsPage';
import { MWResource, MWItem, CommissionItem, CraftedMWObject } from '../lib/types/item';
import { MWMaterial } from '../lib/types/material';
import { Artisan, Tool, Supplement } from '../lib/types/recipe';
import { findMwItem } from '../lib/types/util';

interface AppProps {

}

interface AppState {
	page: string;
	availableItemNames: string[];
    availableItems: CraftedMWObject[];
    unlocked: boolean;
}

export class App extends React.Component<AppProps, AppState> {
	fetchPromise?: Promise<boolean>;

	constructor(props: AppProps) {
		super(props);
		this.state = {
			page: "calculator",
			availableItems: [],
            availableItemNames: [],
            unlocked: true, //TODO: Default to true, for now
		}
	}

	async fetchCsvs(): Promise<boolean> {
        return fetch(`${process.env.PUBLIC_URL}/input/resources.csv`)
            .then(res => res.text())
                .then(stringData => {
                    MWResource.loadCsv(stringData)
            })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/menzoberranzan/resources.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        MWResource.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/materials.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        MWMaterial.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/menzoberranzan/materials.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        MWMaterial.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/items.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        MWItem.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/menzoberranzan/items.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        MWItem.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/artisans.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        Artisan.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/tools.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        Tool.loadCsv(stringData)
                    })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/supplements.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        Supplement.loadCsv(stringData)
            })
            .then(() => fetch(`${process.env.PUBLIC_URL}/input/commissions.csv`))
                .then(res => res.text())
                    .then(stringData => {
                        CommissionItem.loadCsv(stringData)
                    })
            .then(() => {
                this.setState({
                    ...this.state,
                    availableItemNames: [...MWItem.OBJECTS.keys(), ...MWMaterial.OBJECTS.keys()],
                    availableItems: [...MWItem.OBJECTS.values(), ...MWMaterial.OBJECTS.values()]
                })
            })
            .then(() => console.debug("All CSV loaded"))
            // Quick hack to improve performance post-load: craft a couple of items to cache recipe results.
            //.then(() => findMwItem("Silvervine Sceptor").craft())
            //.then(() => findMwItem("Mastered Feathered Ilhuilli").craft())
            .then(() => true);
    }

	componentDidMount() {
        if(this.fetchPromise) {
            return;
        }
        this.fetchPromise = this.fetchCsvs();
    }

	resetCalculations() {
        MWItem.OBJECTS.forEach(mwObj => mwObj.clearCalculations())
        MWMaterial.OBJECTS.forEach(mwObj => mwObj.clearCalculations())
    }

	render() {
		return (
		<div className="App">
			<div id="page-wrapper">
				<div id="panel-wrapper">
					{ this.state.page === "calculator" &&
						<CraftCalc
                            availableItems={this.state.availableItems}
                            unlocked={this.state.unlocked}
                        />
					}
					{ this.state.page === "roadmap" &&
						<Roadmap />
					}
					{ this.state.page === "settings" &&
						<SettingsPage
                            unlocked={this.state.unlocked}
                            resetCalculations={this.resetCalculations}
                            setUnlocked={(unlocked: boolean) => this.setState({...this.state, unlocked: unlocked})}
                        />
					}
					<Footer setPage={(page: string) => this.setState({...this.state, page: page})} />
				</div>
			</div>
		</div>
		)
	}
}

export default App;
