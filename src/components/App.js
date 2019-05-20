import { remote } from 'electron';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { AboutModal } from './modals/AboutModal';
import { ScreenshareModal } from './modals/ScreenshareModal';
import { UpdateModal } from './modals/UpdateModal';
import { Downloads } from './views/Downloads';
import { Landing } from './views/Landing';
import { Preferences } from './views/Preferences';
import { Webviews } from './views/Webviews';
import { DragRegion } from './DragRegion';
import { Preloader } from './Preloader';
import { Sidebar } from './Sidebar';
import { Views } from './Views';
const { dock, menus, touchBar, tray } = remote.require('./main');


const mountRemoteModules = () => {
	dock.mount();
	menus.mount();
	touchBar.mount();
	tray.mount();
};

const unmountRemoteModules = () => {
	dock.unmount();
	menus.unmount();
	touchBar.unmount();
	tray.unmount();
};

export function App() {
	useEffect(() => {
		mountRemoteModules();
		return () => unmountRemoteModules();
	}, []);

	return (
		<Provider store={store}>
			<div className="app-page">
				<DragRegion />

				<Preloader>
					<Sidebar />
					<Views>
						<Landing />
						<Webviews />
						<Downloads />
						<Preferences />
					</Views>
				</Preloader>

				<AboutModal />
				<UpdateModal />
				<ScreenshareModal />
			</div>
		</Provider>
	);
}
