/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { remote } from 'electron';
import { connect } from 'react-redux';
import i18n from '../i18n';
import {
	showLanding,
	showDownloads,
	showServer,
	reloadWebview,
	removeServerFromUrl,
	openDevToolsOnWebview,
	sortServers,
} from '../store/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ServerList } from './sidebar/ServerList';
const { getCurrentWindow, Menu } = remote;


const sidebarItemStyle = css`
	position: relative;
	flex: 0 0 auto;
	box-sizing: border-box;
	margin: 4px 0;
	font-size: 2.5rem;
	line-height: 1.25;

	&[data-tooltip]::after {
		position: absolute;
		top: 50%;
		left: 100%;
		display: block;
		visibility: hidden;
		padding: 0.5rem 1rem;
		content: attr(data-tooltip);
		transition: all 200ms ease-out 200ms;
		transform: translate(10px, -50%);
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		color: #ffffff;
		border-radius: 2px;
		background-color: #1f2329;
		font-size: 0.875rem;
		line-height: normal;
	}

	&[data-tooltip]:hover::after {
		visibility: visible;
		transform: translate(0, -50%);
		opacity: 1;
	}
`;

const SidebarButton = ({ children, ...props }) => (
	<button
		{...props}
		css={[
			sidebarItemStyle,
			css`
				display: flex;
				flex-direction: row;
				padding: 0;
				cursor: pointer;
				color: inherit;
				border: none;
				background: none;
				align-items: center;
				justify-content: center;

				span {
					width: 3rem;
					height: 3rem;
					transition: opacity 200ms;
					opacity: 0.6;
					color: inherit;
					background-color: rgba(0, 0, 0, 0.1);
					font-size: 2rem;
					line-height: 3rem;
				}

				&:hover span {
					opacity: 1;
				}
			`,
		]}
	>
		<span>
			{children}
		</span>
	</button>
);

const AddServerButton = (props) => (
	<SidebarButton {...props} data-tooltip={i18n.__('sidebar.addNewServer')}>
		<FontAwesomeIcon icon={faPlus} />
	</SidebarButton>
);

const DownloadsButton = (props) => (
	<button
		{...props}
		className="sidebar__submenu-action"
		data-tooltip={i18n.__('sidebar.showDownloadManager')}
	>
		<span className="sidebar__action-label">
			<FontAwesomeIcon icon={faDownload} />
		</span>
	</button>
);

const mapStateToProps = ({
	preferences: {
		hasSidebar,
	},
	servers,
	view,
}) => ({
	servers,
	activeServerUrl: view.url,
	visible: hasSidebar,
});

const mapDispatchToProps = (dispatch) => ({
	onClickServer: (url) => dispatch(showServer(url)),
	onContextMenuServer: (url, event) => {
		event.preventDefault();

		const menu = Menu.buildFromTemplate([
			{
				label: i18n.__('sidebar.item.reload'),
				click: () => dispatch(reloadWebview({ url })),
			},
			{
				label: i18n.__('sidebar.item.remove'),
				click: () => dispatch(removeServerFromUrl(url)),
			},
			{
				label: i18n.__('sidebar.item.openDevTools'),
				click: () => dispatch(openDevToolsOnWebview({ url })),
			},
		]);
		menu.popup(getCurrentWindow());
	},
	onSortServers: (urls) => {
		dispatch(sortServers(urls));
	},
	onClickAddServer: () => dispatch(showLanding()),
	onClickDownloads: () => dispatch(showDownloads()),
});

export const Sidebar = connect(mapStateToProps, mapDispatchToProps)(
	function Sidebar({
		servers,
		activeServerUrl,
		visible,
		onClickServer,
		onContextMenuServer,
		onSortServers,
		onClickAddServer,
		onClickDownloads,
	}) {
		const style = servers.filter(({ url }) => activeServerUrl === url).map(({ style }) => style)[0] || {};

		return (
			<div
				className="sidebar"
				css={css`
					display: flex;
					flex-flow: column nowrap;
					align-items: stretch;
					flex: 0 0 68px;
					margin-left: ${ visible ? '0' : '-68px' };
					padding-top: ${ process.platform === 'darwin' ? '18px' : '0' };
					background:
						linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
						${ style.background || 'var(--color-dark)' };
					color: ${ style.color || 'var(--color-white)' };
					transition: margin-left 200ms;
					-webkit-app-region: drag;
				`}
			>
				<ServerList
					servers={servers}
					activeServerUrl={activeServerUrl}
					onSortServers={onSortServers}
					onClickServer={onClickServer}
					onContextMenuServer={onContextMenuServer}
				/>
				<AddServerButton onClick={onClickAddServer} />

				<div className="sidebar__submenu" style={{ marginTop: 'auto' }}>
					<DownloadsButton onClick={onClickDownloads} />
				</div>
			</div>
		);
	}
);
