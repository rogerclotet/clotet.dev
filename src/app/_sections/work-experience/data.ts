export type Job = {
	title: string;
	company: string;
	logo: string;
	url: string;
	period: string;
	text: string;
};

export const workExperience: Job[] = [
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
];
