/** @jsx jsx */
import { css, jsx } from '@emotion/core';


export const Views = ({ children }) => (
	<div
		css={css`
			flex: 1;
			position: relative;
		`}
		className="Views"
	>
		{children}
	</div>
);
