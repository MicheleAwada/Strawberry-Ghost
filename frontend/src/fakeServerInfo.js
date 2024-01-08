function randomImage() {
    const size = (Math.floor(Math.random() * 50)) + 100;
    const width = size*4;
    const height = size*3;
    return `https://picsum.photos/${width}/${height}?random=${Math.random()}`
}

function randomImages() {
    const imagesLength = Math.floor(Math.random() * 5) + 1;
    const images = []
    for (let i = 0; i < imagesLength; i++) {
        images.push(randomImage())
    }
    return images
}


export const products = [
	{
		title: "Lawrence Earings",
		price: 64.78,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			randomImage(),
		id: 1,
		description:
			"direction better sun corner having glass feathers distant fierce construction orbit just hollow quiet floating darkness cow loud would difference bicycle strike bear dawn",
	},
	{
		title: "Elijah Earings",
		price: 21.24,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			randomImage(),
		id: 2,
		description:
			"cool choose require knowledge hit represent fair whom ride dozen farmer dirt gain metal new bow relationship four break goose men saw nation across",
	},
	{
		title: "Beulah Earings",
		price: 80.72,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			randomImage(),
		id: 3,
		description:
			"winter board period refused nervous route bigger member clothes dropped verb essential piano chapter secret had coach trade have date paragraph farm ear charge",
	},
	{
		title: "Edna Earings",
		price: 65.84,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			randomImage(),
		id: 4,
		description:
			"audience outside for old missing wool fairly duty location total tool different weigh community object guard year climate repeat peace lying piano distance moment",
	},
	{
		title: "Jayden Earings",
		price: 13.59,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			randomImage(),
		id: 5,
		description:
			"had shadow habit satisfied upward though refer function best art paragraph invented brush golden exist begun taste nest rose round clothing sold prove white",
	},
	{
		title: "Sophia Earings",
		price: 56.80,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			randomImage(),
		id: 6,
		description:
			"partly constantly machine rope mental fear jar column hard glad jump create prove pipe breathe fireplace solid model clock her deer wagon bent measure",
	},
	{
		title: "Lily Earings",
		price: 59.42,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			randomImage(),
		id: 7,
		description:
			"next stretch thin alone cent somewhere swimming terrible call these view bread pour moment huge something fighting zoo union identity monkey spin by describe",
	},
];
