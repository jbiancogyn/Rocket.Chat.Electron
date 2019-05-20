/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useEffect, useState } from 'react';
import { Server } from './Server';


export function ServerList({ servers, activeServerUrl, onSortServers, onClickServer, onContextMenuServer }) {
	const [showShortcuts, setShowShortcuts] = useState(false);
	const [draggedServerUrl, setDraggedServerUrl] = useState(null);
	const [sortedServers, setSortedServers] = useState(servers);

	useEffect(() => {
		setSortedServers(servers);
	}, [servers]);

	useEffect(() => {
		const createShortcutKeyEventHandler = (down) => (event) => {
			const shortcutKey = process.platform === 'darwin' ? 'Meta' : 'Control';
			if (event.key === shortcutKey) {
				setShowShortcuts(down);
			}
		};

		const handleShortcutKeyDown = createShortcutKeyEventHandler(true);
		const handleShortcutKeyUp = createShortcutKeyEventHandler(false);

		window.addEventListener('keydown', handleShortcutKeyDown);
		window.addEventListener('keyup', handleShortcutKeyUp);

		return () => {
			window.removeEventListener('keydown', handleShortcutKeyDown);
			window.removeEventListener('keyup', handleShortcutKeyUp);
		};
	}, []);

	const handleDragStart = (event) => {
		event.dataTransfer.dropEffect = 'move';
		event.dataTransfer.effectAllowed = 'move';
		setDraggedServerUrl(event.currentTarget.dataset.url);
	};

	const handleDragEnd = () => {
		setDraggedServerUrl(null);
		const orderedUrls = sortedServers.map(({ url }) => url);
		onSortServers && onSortServers(orderedUrls);
		onClickServer && onClickServer(draggedServerUrl);
	};

	const handleDragEnter = ({ currentTarget }) => {
		const srcServer = sortedServers.find(({ url }) => url === draggedServerUrl);
		const destServer = sortedServers.find(({ url }) => url === currentTarget.dataset.url);
		setSortedServers(sortedServers.map((server) => (
			(server.url === srcServer.url && destServer) ||
			(server.url === destServer.url && srcServer) ||
			server
		)));
	};

	const handleDragOver = (event) => {
		event.preventDefault();
	};

	return (
		<ol
			className={[
				'sidebar__server-list',
			].filter(Boolean).join(' ')}
			css={css`
				display: flex;
				flex-direction: column;
				flex: 0 0 auto;
				margin: 0;
				padding: 10px 0 0 0;
				align-items: stretch;
				-webkit-app-region: no-drag;
			`}
		>
			{sortedServers.map((server, order) => (
				<Server
					key={order}
					server={{ ...server, active: server.url === activeServerUrl, order }}
					dragging={draggedServerUrl === server.url}
					showShortcut={showShortcuts}
					onClick={onClickServer.bind(null, server.url)}
					onContextMenu={onContextMenuServer.bind(null, server.url)}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					onDragEnter={handleDragEnter}
					onDragOver={handleDragOver}
				/>
			))}
		</ol>
	);
}
