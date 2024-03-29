function randomImage() {
    const size = (Math.floor(Math.random() * 1000)) + 100;
    const width = size*4;
    const height = size*3;
    return `https://picsum.photos/${width}/${height}?random=${Math.random()}`
}

function randomImages() {
    const imagesLength = Math.floor(Math.random() * 5) + 1;
    const images = []
    for (let i = 0; i < imagesLength; i++) {
        images.push({image: randomImage(), alt: "randomalt"})
    }
    return images
}


export const products = [
	{
		title: "Lawrence Chambers Earings",
		price: 64.78,
		inCart: false,
		frequentlyBoughtTogether: [
			7,
			5
		],
		variants: [
			{ id: 1, default: true, isColor: true, color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ id: 2, default: false, isColor: true, color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ id: 3, default: false, isColor: true, color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
			{ id: 4, default: false, isColor: false, name: "big ear", images: [
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
		title: "Elijah Meyer Earings",
		price: 21.24,
		inCart: false,
		frequentlyBoughtTogether: [
			3,
			1
		],
		variants: [
			{ id: 1, default: true, isColor: true, color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ id: 2, default: false, isColor: true, color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ id: 3, default: false, isColor: true, color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
			{ id: 4, default: false, isColor: false, name: "big ear", images: [
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
		title: "Beulah Horton Earings",
		price: 80.72,
		inCart: false,
		frequentlyBoughtTogether: [
			5,
			4
		],
		variants: [
			{ id: 1, default: true, isColor: true, color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ id: 2, default: false, isColor: true, color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ id: 3, default: false, isColor: true, color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
			{ id: 4, default: false, isColor: false, name: "big ear", images: [
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
		title: "Edna Richards Edna Loves Earings No Cap My Sister YARRR Strawberry ghost Earings",
		price: 65.84,
		inCart: false,
		frequentlyBoughtTogether: [
			3,
			7
		],
		variants: [
			{ id: 1, default: true, isColor: true, color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ id: 2, default: false, isColor: true, color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ id: 3, default: false, isColor: true, color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
			{ id: 4, default: false, isColor: false, name: "big ear", images: [
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
		title: "Jayden Bishop Ortiz Earings",
		price: 13.59,
		inCart: false,
		frequentlyBoughtTogether: [
			1,
			3
		],
		variants: [
			{ id: 1, default: true, isColor: true, color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ id: 2, default: false, isColor: true, color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ id: 3, default: false, isColor: true, color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
			{ id: 4, default: false, isColor: false, name: "big ear", images: [
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
		title: "Sophia Gross Earings",
		price: 56.80,
		inCart: false,
		frequentlyBoughtTogether: [
			2,
			7
		],
		variants: [
			{ id: 1, default: true, isColor: true, color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ id: 2, default: false, isColor: true, color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ id: 3, default: false, isColor: true, color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
			{ id: 4, default: false, isColor: false, name: "big ear", images: [
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
		title: "Lily Crawford Earings",
		price: 59.42,
		inCart: false,
		frequentlyBoughtTogether: [
			6,
			5
		],
		variants: [
			{ id: 1, default: true, isColor: true, color: "#f00", name: "Red version", images: [
                ...randomImages()
            ] },
			{ id: 2, default: false, isColor: true, color: "#00f", name: "Tyranasorous version", images: [
                ...randomImages()
            ] },
			{ id: 3, default: false, isColor: true, color: "#0f0", name: "Dark Vader", images: [
                ...randomImages()
            ] },
			{ id: 4, default: true, isColor: false, name: "big ear", images: [
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

export const user = {
	isAuthenticated: true,
	firstname: "Etta",
	lastname: "Roberson",
	email: "ettaroberson@gmail.com",
	address: "123 Main Street",
	id: 2,
	orders: [
		{
			id: 2,
			productsBought: [
				{product: 2, quantity: 1, variant: 3},
				{product: 4, quantity: 2, variant: 3},
				
			],
			status: "making",
			time: "Jan 4 2024"
		},
		{
			id: 5,
			productsBought: [
				{product: 1, quantity: 1, variant: 3},
				{product: 1, quantity: 3, variant: 1},
			],
			status: "shipping",
			time: "Dec 16 2023"
		},
		{
			id: 7,
			productsBought: [
				{product: 4, quantity: 2, variant: 3},
				{product: 2, quantity: 13, variant: 2},
			],
			status: "shipped",
			time: "Dec 8 2023"
		},
		{
			id: 10,
			productsBought: [
				{product: 6, quantity: 1, variant: 1},
				{product: 7, quantity: 4, variant: 2},
				{product: 5, quantity: 3, variant: 1},
			],
			status: "delivered",
			time: "Dec 2 2023"
		},
	],
	cart: [
		{product: 5, quantity: 2, saveForLater: true, variant: 1},
		{product: 4, quantity: 6, saveForLater: false, variant: 3},
		{product: 7, quantity: 9, saveForLater: false, variant: 2},
	]
}