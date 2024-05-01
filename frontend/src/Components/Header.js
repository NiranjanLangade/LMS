import { React, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

import MenuIcon from "@material-ui/icons/Menu";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";

function Header() {
	const [menutoggle, setMenutoggle] = useState(false);
	const { t } = useTranslation();

	const Toggle = () => {
		setMenutoggle(!menutoggle);
	};

	const closeMenu = () => {
		setMenutoggle(false);
	};

	return (
		<div className="header">
			<div className="logo-nav">
				<Link to="/">
					<a href="#home">{t("logo")}</a>
				</Link>
			</div>
			<div className="nav-right">
				<input className="search-input" type="text" placeholder={t("search")} />
				<ul className={menutoggle ? "nav-options active" : "nav-options"}>
					<li
						className="option"
						onClick={() => {
							closeMenu();
						}}
					>
						<Link to="/">
							<a href="#home">{t("home")}</a>
						</Link>
					</li>
					<li
						className="option"
						onClick={() => {
							closeMenu();
						}}
					>
						<Link to="/signin">
							<a href="signin">{t("signin")}</a>
						</Link>
					</li>
				</ul>
			</div>

			<div
				className="mobile-menu"
				onClick={() => {
					Toggle();
				}}
			>
				{menutoggle ? (
					<ClearIcon className="menu-icon" style={{ fontSize: 40 }} />
				) : (
					<MenuIcon className="menu-icon" style={{ fontSize: 40 }} />
				)}
			</div>
		</div>
	);
}

export default Header;
