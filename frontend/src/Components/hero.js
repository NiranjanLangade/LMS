import React from "react";
import "./hero.css";
import "../i18n";
import { useTranslation } from "react-i18next";

function Hero() {
	const { t } = useTranslation();
	return (
		<div className="slider">
			<img
				className="slider-image"
				src="https://i.pinimg.com/564x/f2/1c/2f/f21c2f27294e010cdc2af50533b90228.jpg"
				alt="Library"
			/>
			<div className="slider-caption">
				<h3>{t("greeting")}</h3>
				<p>{t("heroDes")}</p>
			</div>
		</div>
	);
}

export default Hero;
