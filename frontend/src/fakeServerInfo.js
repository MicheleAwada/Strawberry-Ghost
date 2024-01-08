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
		title: "Johny Earings",
		price: 24,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Blue version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "green", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			"https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
		id: 1,
		description:
			"direction better sun corner having glass feathers distant fierce construction orbit just hollow quiet floating darkness cow loud would difference bicycle strike bear dawn",
	},
	{
		title: "Johny Earings",
		price: 24,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Blue version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "green", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			"https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
		id: 2,
		description:
			"cool choose require knowledge hit represent fair whom ride dozen farmer dirt gain metal new bow relationship four break goose men saw nation across",
	},
	{
		title: "Johny Earings",
		price: 24,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Blue version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "green", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			"https://static.vecteezy.com/system/resources/previews/008/550/662/original/strawberry-fruit-transparent-png.png",
		id: 3,
		description:
			"winter board period refused nervous route bigger member clothes dropped verb essential piano chapter secret had coach trade have date paragraph farm ear charge",
	},
	{
		title: "Johny Earings",
		price: 24,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Blue version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "green", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			"https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
		id: 4,
		description:
			"audience outside for old missing wool fairly duty location total tool different weigh community object guard year climate repeat peace lying piano distance moment",
	},
	{
		title: "Johny Earings",
		price: 24,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Blue version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "green", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			"https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
		id: 5,
		description:
			"had shadow habit satisfied upward though refer function best art paragraph invented brush golden exist begun taste nest rose round clothing sold prove white",
	},
	{
		title: "Johny Earings",
		price: 24,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Blue version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "green", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			"https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
		id: 6,
		description:
			"partly constantly machine rope mental fear jar column hard glad jump create prove pipe breathe fireplace solid model clock her deer wagon bent measure",
	},
	{
		title: "Johny Earings",
		price: 24,
		inCart: false,
		colors: [
			{ color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ color: "#00f", name: "Blue version", images: [
                ...randomImages()
            ] },
			{ color: "#0f0", name: "green", images: [
                ...randomImages()
            ] },
		],
		thumbnail:
			"https://t3.ftcdn.net/jpg/03/25/61/62/360_F_325616239_jPMacbnlr5hNYLBOazcKMtwvLWGKUEy3.jpg",
		id: 7,
		description:
			"next stretch thin alone cent somewhere swimming terrible call these view bread pour moment huge something fighting zoo union identity monkey spin by describe",
	},
];
