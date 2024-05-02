import React from "react";

import Footer from "../Components/Footer";
import Hero from "../Components/hero";
import i18n from "i18next";

i18n.changeLanguage("en");

function Home() {
	return (
		<div id="home">
			<Hero />
			<Footer />
		</div>
	);
}

export default Home;
