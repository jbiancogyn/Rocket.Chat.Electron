/** @jsx jsx */
import { jsx } from '@emotion/core';


export const Landing = () => (
	<section className="landing">
		<div className="landing__wrapper">
			<div>
				<img className="landing__logo" src="./images/logo-dark.svg" />
			</div>
			<form className="landing__form" method="/">
				<h2 className="landing__form-prompt">Enter your server URL</h2>
				<div>
					<input type="text" name="server-url" placeholder="https://open.rocket.chat" dir="auto" className="landing__form-host-field" />
				</div>
				<div className="landing__form-error" />
				<div>
					<button type="submit" className="button primary login landing__form-submit-button">Connect</button>
				</div>
			</form>
		</div>
	</section>
);
