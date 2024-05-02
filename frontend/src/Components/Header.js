import { React, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

import MenuIcon from "@material-ui/icons/Menu";
import ClearIcon from "@material-ui/icons/Clear";
import { useTranslation } from "react-i18next";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

function Header() {
	const [menutoggle, setMenutoggle] = useState(false);
	const [language, setLanguage] = useState("en");
	const { t, i18n } = useTranslation();

	const Toggle = () => {
		setMenutoggle(!menutoggle);
	};

	const closeMenu = () => {
		setMenutoggle(false);
	};

	const changeLanguage = event => {
		const selectedLanguage = event.target.value;
		setLanguage(selectedLanguage);
		i18n.changeLanguage(selectedLanguage);
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
					<Select
						value={language}
						onChange={changeLanguage}
						className="language-select"
					>
						<MenuItem value="en">English</MenuItem>
						<MenuItem value="mr">Marathi</MenuItem>
						<MenuItem value="hi">Hindi</MenuItem>
						<MenuItem value="fr">French</MenuItem>
					</Select>

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
