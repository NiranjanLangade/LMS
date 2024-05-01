import React from "react";
import "./Footer.css";

import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TelegramIcon from "@material-ui/icons/Telegram";
import InstagramIcon from "@material-ui/icons/Instagram";
import { useTranslation } from "react-i18next";

function Footer() {
	const { t } = useTranslation();
	return (
		<div className="footer">
			<div>
				<div className="footer-data">
					<div className="contact-details">
						<h1>{t("heading")}</h1>
						<p>{t("librarian")}</p>
						<p>{t("institute")}</p>
						<p>{t("address")}</p>
						<p>{t("state")}</p>
						<p>{t("country")}</p>
						<p>{t("email")}</p>
					</div>
					<div className="librarian-details">
						<h1>{t("librarian")}: </h1>
						<p>{t("name")}</p>
						<p>{t("qualification")}</p>
						<p>{t("contact")}</p>
					</div>
				</div>
				<div className="contact-social">
					<a href="#home" className="social-icon">
						<TwitterIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} />
					</a>
					<a href="#home" className="social-icon">
						<LinkedInIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} />
					</a>
					<a href="#home" className="social-icon">
						<TelegramIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} />
					</a>
					<a href="#home" className="social-icon">
						<InstagramIcon style={{ fontSize: 40, color: "rgb(283,83,75)" }} />
					</a>
				</div>
			</div>
			<div className="copyright-details">
				<p className="footer-copyright">
					&#169; {t("copyright")}
					<br />
					<span>{t("project")}</span>
				</p>
			</div>
		</div>
	);
}

export default Footer;
