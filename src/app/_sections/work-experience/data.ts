import type { Locale } from "@/lib/i18n/locale";

export type Job = {
	title: string;
	company: string;
	logo: string;
	url: string;
	period: string;
	text: string;
};

const workExperience = [
	{
		title: "Senior Software Engineer",
		company: "Pensero",
		logo: "/jobs/pensero.png",
		url: "https://pensero.ai",
		period: "June 2026 - Present",
		text: `I build an AI-powered engineering performance platform at Pensero, helping leaders understand delivery, code quality, and the impact of AI across their organization.`,
	},
	{
		title: "Senior Software Engineer",
		company: "Eventbrite",
		logo: "/jobs/eventbrite.png",
		url: "https://www.eventbrite.com",
		period: "June 2024 - June 2026",
		text: `I worked on the payments team as a full-stack engineer. We owned Python services for payment operations and frontend libraries built with React and Redux, running on AWS.
I helped integrate Stripe and buy now, pay later payment methods to support purchases of higher-priced tickets.
I also took part in the on-call rotation to keep our services running reliably.`,
	},
	{
		title: "Senior Software Engineer",
		company: "Perk",
		logo: "/jobs/perk.png",
		url: "https://travelperk.com",
		period: "June 2019 - March 2020, November 2021 - April 2024",
		text: `I worked at Perk, then called TravelPerk, as a senior full-stack software engineer. I used React on the frontend and Python with Django and Tornado on the backend.
I helped migrate the frontend codebase from JavaScript with Flow to TypeScript, making it easier to maintain and finding bugs along the way.
I contributed to shared backend projects and worked with the frontend and backend guilds to improve development practices and code quality.
I also helped hire and onboard new teammates and improve our interview process.
I left to improve my work-life balance and rejoined when remote work became an option.`,
	},
	{
		title: "Senior Software Engineer",
		company: "Typeform",
		logo: "/jobs/typeform.png",
		url: "https://typeform.com",
		period: "March 2020 - November 2021",
		text: `I was the sole backend engineer on the team responsible for form building. I maintained backend services, added features, and contributed to the frontend when needed.
I also worked on improving the developer experience and code quality.`,
	},
	{
		title: "Senior Software Engineer",
		company: "Socialpoint",
		logo: "/jobs/socialpoint.png",
		url: "https://www.socialpoint.es",
		period: "June 2012 - May 2019",
		text: `At Socialpoint, I developed the server side of mobile games with millions of daily active users. I spent five years on a team of five and later a year on a team of two.
I led the project to introduce our first real-time backend component in Go and improved continuous deployment for the real-time servers.
Much of my work involved concurrency and high availability, using PHP with Symfony and Go on AWS.`,
	},
] as const satisfies readonly Job[];

const translations = {
	ca: {
		Pensero: {
			period: "Juny de 2026 - Actualitat",
			text: "A Pensero desenvolupo una plataforma d'anàlisi del rendiment dels equips d'enginyeria amb intel·ligència artificial. Ajuda els responsables a entendre el lliurament de programari, la qualitat del codi i l'impacte de la IA a tota l'organització.",
		},
		Eventbrite: {
			period: "Juny de 2024 - Juny de 2026",
			text: `Vaig treballar a l'equip de pagaments com a enginyer full-stack. Ens encarregàvem de serveis en Python per a les operacions de pagament i de biblioteques de frontend amb React i Redux, tot a AWS.
Vaig ajudar a integrar Stripe i mètodes de pagament ajornat per facilitar la compra d'entrades de preu més elevat.
També vaig participar en els torns de guàrdia per garantir la fiabilitat dels serveis.`,
		},
		Perk: {
			period: "Juny de 2019 - Març de 2020, novembre de 2021 - Abril de 2024",
			text: `Vaig treballar a Perk, que aleshores es deia TravelPerk, com a enginyer sènior de programari full-stack. Feia servir React al frontend i Python amb Django i Tornado al backend.
Vaig ajudar a migrar el codi del frontend de JavaScript amb Flow a TypeScript, cosa que en va facilitar el manteniment i ens va permetre detectar errors.
Vaig contribuir a projectes compartits de backend i vaig treballar amb els grups de frontend i backend per millorar les pràctiques de desenvolupament i la qualitat del codi.
També vaig ajudar a contractar i incorporar nous companys i a millorar el procés d'entrevistes.
Vaig marxar per conciliar millor la vida laboral i personal, i hi vaig tornar quan es va oferir la possibilitat de treballar a distància.`,
		},
		Typeform: {
			period: "Març de 2020 - Novembre de 2021",
			text: `Era l'únic enginyer de backend de l'equip responsable de la creació de formularis. Mantenia els serveis de backend, hi afegia funcionalitats i contribuïa al frontend quan calia.
També vaig treballar per millorar l'experiència de desenvolupament i la qualitat del codi.`,
		},
		Socialpoint: {
			period: "Juny de 2012 - Maig de 2019",
			text: `A Socialpoint vaig desenvolupar la part del servidor de jocs per a mòbil amb milions d'usuaris actius diaris. Vaig passar cinc anys en un equip de cinc persones i, més endavant, un any en un equip de dues.
Vaig liderar el projecte per introduir el nostre primer component de backend en temps real amb Go i vaig millorar el desplegament continu dels servidors en temps real.
Bona part de la meva feina se centrava en la concurrència i l'alta disponibilitat, amb PHP, Symfony i Go a AWS.`,
		},
	},
	es: {
		Pensero: {
			period: "Junio de 2026 - Actualidad",
			text: "En Pensero desarrollo una plataforma de análisis del rendimiento de los equipos de ingeniería con inteligencia artificial. Ayuda a los responsables a entender la entrega de software, la calidad del código y el impacto de la IA en toda la organización.",
		},
		Eventbrite: {
			period: "Junio de 2024 - Junio de 2026",
			text: `Trabajé en el equipo de pagos como ingeniero full-stack. Nos encargábamos de servicios en Python para las operaciones de pago y de bibliotecas de frontend con React y Redux, todo en AWS.
Ayudé a integrar Stripe y métodos de pago aplazado para facilitar la compra de entradas de mayor precio.
También participé en los turnos de guardia para garantizar la fiabilidad de los servicios.`,
		},
		Perk: {
			period:
				"Junio de 2019 - Marzo de 2020, noviembre de 2021 - Abril de 2024",
			text: `Trabajé en Perk, que entonces se llamaba TravelPerk, como ingeniero sénior de software full-stack. Usaba React en el frontend y Python con Django y Tornado en el backend.
Ayudé a migrar el código del frontend de JavaScript con Flow a TypeScript, lo que facilitó su mantenimiento y nos permitió detectar errores.
Contribuí a proyectos compartidos de backend y trabajé con los grupos de frontend y backend para mejorar las prácticas de desarrollo y la calidad del código.
También ayudé a contratar e incorporar nuevos compañeros y a mejorar el proceso de entrevistas.
Me fui para conciliar mejor la vida laboral y personal, y volví cuando se ofreció la posibilidad de trabajar a distancia.`,
		},
		Typeform: {
			period: "Marzo de 2020 - Noviembre de 2021",
			text: `Era el único ingeniero de backend del equipo responsable de la creación de formularios. Mantenía los servicios de backend, añadía funcionalidades y contribuía al frontend cuando hacía falta.
También trabajé para mejorar la experiencia de desarrollo y la calidad del código.`,
		},
		Socialpoint: {
			period: "Junio de 2012 - Mayo de 2019",
			text: `En Socialpoint desarrollé la parte del servidor de juegos para móvil con millones de usuarios activos diarios. Pasé cinco años en un equipo de cinco personas y, más adelante, un año en un equipo de dos.
Lideré el proyecto para introducir nuestro primer componente de backend en tiempo real con Go y mejoré el despliegue continuo de los servidores en tiempo real.
Buena parte de mi trabajo se centraba en la concurrencia y la alta disponibilidad, con PHP, Symfony y Go en AWS.`,
		},
	},
} satisfies Record<
	Exclude<Locale, "en">,
	Record<
		(typeof workExperience)[number]["company"],
		Pick<Job, "period" | "text">
	>
>;

export function getWorkExperience(locale: Locale): Job[] {
	if (locale === "en") return [...workExperience];
	return workExperience.map((job) => ({
		...job,
		...translations[locale][job.company],
		title:
			locale === "ca"
				? "Enginyer sènior de programari"
				: "Ingeniero sénior de software",
	}));
}
