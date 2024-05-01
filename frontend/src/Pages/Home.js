import React from "react";

import Footer from "../Components/Footer";
import Hero from "../Components/hero";
import i18n from "i18next";

// Change the language to French
i18n.changeLanguage("mr");

function Home() {
	return (
		<div id="home">
			<Hero />
			<Footer />
		</div>
	);
}

export default Home;
