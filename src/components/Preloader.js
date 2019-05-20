/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { LoadingScreen } from './LoadingScreen';


const PreloaderView = ({ loading, children }) => (
	<div
		css={css`
			display: flex;
			flex-flow: row nowrap;
			align-items: stretch;
			width: 100vw;
			height: 100vh;
		`}
	>
		{loading && <LoadingScreen />}
		{children}
	</div>
);

const mapStateToProps = ({ loading }) => ({ loading });

export const Preloader = connect(mapStateToProps)(PreloaderView);
