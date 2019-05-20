/** @jsx jsx */
import { css, jsx } from '@emotion/core';
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { parse as parseUrl } from 'url';


const Shortcut = ({ visible, number }) => (
	<div
		css={css`
			visibility: ${ visible ? 'visible' : 'hidden' };
			flex: 1 0 100%;
			padding-top: 8px;
			text-align: center;
			font-size: 12px;
			line-height: 1;
		`}
	>
		{process.platform === 'darwin' ? '⌘' : '^'}{number + 1}
	</div>
);

function Icon({ url, title, active }) {
	const [faviconLoaded, setFaviconLoaded] = useState(false);

	const initials = (
		(title || url)
			.replace(url, parseUrl(url).hostname)
			.split(/[^A-Za-z0-9]+/g)
			.slice(0, 2)
			.map((text) => text.slice(0, 1).toUpperCase())
			.join('')
	);

	const faviconCacheBustingTime = 15 * 60 * 1000;
	const bustingParam = Math.round(Date.now() / faviconCacheBustingTime);
	const faviconUrl = `${ url.replace(/\/$/, '') }/assets/favicon.svg?_=${ bustingParam }`;

	return (
		<>
			<span
				css={css`
					display: ${ faviconLoaded ? 'none' : 'inline' };
					flex: 1 1 auto;
					transition: opacity 200ms;
					text-align: center;
					opacity: ${ (active && '1') || '0.6' };
					line-height: 42px;

					*:hover > & {
						opacity: 0.8;
					}
				`}
			>
				{initials}
			</span>
			<img
				draggable={false}
				src={faviconUrl}
				css={css`
					display: ${ faviconLoaded ? 'initial' : 'none' };
					flex: 1 1 auto;
					width: 42px;
					height: 42px;
					transition: opacity 200ms;
					opacity: ${ (active && '1') || '0.6' };
					object-fit: contain;

					*:hover > & {
						opacity: 0.8;
					}
				`}
				onLoad={() => setFaviconLoaded(true)}
				onError={() => setFaviconLoaded(false)}
			/>
		</>
	);
}

function Badge({ badge }) {
	const count = (badge || badge === 0) ? parseInt(badge, 10) : null;

	return (
		<div
			css={css`
				position: absolute;
				z-index: 1;
				top: 2px;
				right: 8px;
				display: block;
				min-width: 15px;
				text-align: center;
				color: #ffffff;
				border-radius: 20px;
				background-color: #e43325;
				box-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
				font-size: 10px;
				font-weight: bold;
				line-height: 15px;
			`}
		>
			{Number.isInteger(count) ? String(count) : ''}
		</div>
	);
}

export function Server({ server: { url, title = url, order, active, badge }, dragging, showShortcut, ...props }) {
	const hasUnreadMessages = !!badge;

	return (
		<li
			{...props}
			draggable="true"
			data-url={url}
			data-tooltip={
				(url !== 'https://open.rocket.chat' && title === 'Rocket.Chat') ? `${ title } - ${ url }` : title
			}
			css={css`
				position: relative;
				display: flex;
				cursor: pointer;
				flex: 0 0 auto;
				box-sizing: border-box;
				margin: 4px 0;
				font-size: 2.5rem;
				line-height: 1.25;
				color: inherit;
				align-items: center;
				flex-flow: row wrap;
				justify-content: space-between;
				opacity: ${ (dragging && '0.5') || '1' };

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
					z-index: 10;
				}

				&[data-tooltip]:hover::after {
					visibility: visible;
					transform: translate(0, -50%);
					opacity: 1;
				}

				&::before {
					flex: 0 0 auto;
					width: 5px;
					height: ${ (active && '30px') || (hasUnreadMessages && '6px') || '0' };
					margin-right: -5px;
					content: "";
					transition:
						height 200ms,
						opacity 200ms;
					opacity: ${ (active && '1') || (hasUnreadMessages && '0.6') || '1' };
					border-radius: 0 3px 3px 0;
					background-color: #ffffff;
				}
			`}
		>
			<Icon url={url} title={title} active={active} />
			<Badge badge={badge} />
			<Shortcut visible={showShortcut} number={order} />
		</li>
	);
}
