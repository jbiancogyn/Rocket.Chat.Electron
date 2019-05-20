/** @jsx jsx */
import { jsx } from '@emotion/core';
import { connect } from 'react-redux';


const mapStateToProps = ({
	view,
}) => ({
	visible: view === 'downloads',
});

export const Downloads = connect(mapStateToProps)(
	function Downloads({ visible }) {
		return (
			<div className="app-download-manager" style={{ display: visible ? 'flex' : 'none' }} data-tooltip="Show Download manager">
				<div className="app-download-manager-actions">
					<div className="app-download-manager-title"><b>Downloads</b></div>
					<button className="app-download-manager-clear-action" data-tooltip="Clear download list">
						Clear all items
					</button>
				</div>
				<div className="app-download-manager-items">
					{/* place download items*/}
				</div>
			</div>
		);
	}
);
