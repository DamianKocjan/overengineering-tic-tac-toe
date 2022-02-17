const colors = require("tailwindcss/colors");

const brandColor = colors.indigo;

module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				gray: colors.gray,
				brand: brandColor,
			},
			ringColor: {
				DEFAULT: brandColor["500"],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
