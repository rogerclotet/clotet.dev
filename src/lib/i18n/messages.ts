import type { Locale } from "./locale";

const en = {
	privacy: "Privacy",
	privacyTracking:
		"This website does not use analytics scripts, record browsing sessions, or track page views and clicks.",
	privacyPreferences:
		"The language selector saves your chosen language in a cookie for one year. This cookie is only used to remember your preference.",
	privacyHosting:
		"The website's hosting service receives connection information, including your IP address, to deliver pages. Contact me at the address below with any privacy questions.",
	language: "Language",
	languageError: "Could not change the language. Please try again.",
	home: "Home",
	logo: "Roger Clotet logo",
	intro: "Intro",
	projects: "Projects",
	experience: "Experience",
	contact: "Contact",
	hello: "Hello, World!",
	bio: "Dad, software engineer, and curious by nature. Based in Girona.",
	building: "I work on web apps and distributed systems.",
	interests:
		"My downtime usually involves a controller, a camera, or a steering wheel.",
	projectsIntro:
		"These are some of my personal projects. Most things I develop as side projects don't end up anywhere and only serve as learning experiences. Here are some of the ones worth sharing.",
	workExperience: "Work experience",
	resume: "Resume",
	outro: "That's it!",
	collaboration:
		"I'm always working on side projects and open to collaborating.",
	getInTouch: "Feel free to get in touch!",
	visit: "Visit",
	sourceCode: "Source code",
	close: "Close",
	categories: {
		website: "Website",
		webapp: "Web app",
		mobileapp: "Mobile app",
		game: "Game",
	},
	blogTitle: "Dev Learnings",
	blogDescription: "My notes on software development",
	latestArticles: "Latest articles",
	filteredBy: "Filtered by",
	clearFilter: "Clear filter",
	relatedArticles: "Related articles:",
	moreArticles: "← More articles",
};

export const messages = {
	en,
	ca: {
		privacy: "Privacitat",
		privacyTracking:
			"Aquest web no fa servir scripts d'analítica, no grava sessions de navegació ni fa seguiment de visualitzacions de pàgines o clics.",
		privacyPreferences:
			"El selector d'idioma desa la llengua escollida en una galeta durant un any. Aquesta galeta només es fa servir per recordar la teva preferència.",
		privacyHosting:
			"El servei d'allotjament del web rep informació de connexió, inclosa l'adreça IP, per servir les pàgines. Per a qualsevol dubte sobre privacitat, escriu-me a l'adreça següent.",
		language: "Llengua",
		languageError: "No s'ha pogut canviar la llengua. Torna-ho a provar.",
		home: "Inici",
		logo: "Logotip de Roger Clotet",
		intro: "Inici",
		projects: "Projectes",
		experience: "Experiència",
		contact: "Contacte",
		hello: "Hola, món!",
		bio: "Pare, enginyer de programari i curiós de mena. Visc a Girona.",
		building: "Treballo en aplicacions web i sistemes distribuïts.",
		interests:
			"En el meu temps lliure, sol haver-hi un comandament, una càmera o un volant pel mig.",
		projectsIntro:
			"Aquests són alguns dels meus projectes personals. La majoria de coses que desenvolupo en el meu temps lliure no arriben enlloc i només em serveixen per aprendre. Aquí en tens alguns que val la pena compartir.",
		workExperience: "Experiència professional",
		resume: "Currículum",
		outro: "Això és tot!",
		collaboration:
			"Sempre tinc projectes personals entre mans i estic obert a col·laborar.",
		getInTouch: "No dubtis a contactar amb mi!",
		visit: "Visita",
		sourceCode: "Codi font",
		close: "Tanca",
		categories: {
			website: "Lloc web",
			webapp: "Aplicació web",
			mobileapp: "Aplicació mòbil",
			game: "Joc",
		},
		blogTitle: "Aprenentatges de programació",
		blogDescription: "Les meves notes sobre desenvolupament de programari",
		latestArticles: "Últims articles",
		filteredBy: "Filtrat per",
		clearFilter: "Esborra el filtre",
		relatedArticles: "Articles relacionats:",
		moreArticles: "← Més articles",
	},
	es: {
		privacy: "Privacidad",
		privacyTracking:
			"Esta web no usa scripts de analítica, no graba sesiones de navegación ni hace seguimiento de visualizaciones de páginas o clics.",
		privacyPreferences:
			"El selector de idioma guarda la lengua elegida en una cookie durante un año. Esta cookie solo se usa para recordar tu preferencia.",
		privacyHosting:
			"El servicio de alojamiento de la web recibe información de conexión, incluida tu dirección IP, para servir las páginas. Para cualquier duda sobre privacidad, escríbeme a la siguiente dirección.",
		language: "Idioma",
		languageError: "No se ha podido cambiar el idioma. Inténtalo de nuevo.",
		home: "Inicio",
		logo: "Logotipo de Roger Clotet",
		intro: "Inicio",
		projects: "Proyectos",
		experience: "Experiencia",
		contact: "Contacto",
		hello: "¡Hola, mundo!",
		bio: "Padre, ingeniero de software y curioso por naturaleza. Vivo en Girona.",
		building: "Trabajo en aplicaciones web y sistemas distribuidos.",
		interests:
			"En mi tiempo libre, suele haber un mando, una cámara o un volante de por medio.",
		projectsIntro:
			"Estos son algunos de mis proyectos personales. La mayoría de las cosas que desarrollo en mi tiempo libre no llegan a ninguna parte y solo me sirven para aprender. Aquí tienes algunos que merece la pena compartir.",
		workExperience: "Experiencia profesional",
		resume: "Currículum",
		outro: "¡Eso es todo!",
		collaboration:
			"Siempre tengo proyectos personales entre manos y estoy abierto a colaborar.",
		getInTouch: "¡No dudes en contactar conmigo!",
		visit: "Visitar",
		sourceCode: "Código fuente",
		close: "Cerrar",
		categories: {
			website: "Sitio web",
			webapp: "Aplicación web",
			mobileapp: "Aplicación móvil",
			game: "Juego",
		},
		blogTitle: "Aprendizajes de programación",
		blogDescription: "Mis notas sobre desarrollo de software",
		latestArticles: "Últimos artículos",
		filteredBy: "Filtrado por",
		clearFilter: "Borrar el filtro",
		relatedArticles: "Artículos relacionados:",
		moreArticles: "← Más artículos",
	},
} satisfies Record<Locale, typeof en>;
