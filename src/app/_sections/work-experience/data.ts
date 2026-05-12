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
		company: "Eventbrite",
		logo: "/jobs/eventbrite.png",
		url: "https://www.eventbrite.com",
		period: "June 2024 - Present",
		text: `I'm currently working in the payments team as a full-stack engineer. We own several Python backend services managing payments-related operations, and frontend libraries using React and Redux. Our infrastructure is hosted on AWS. I'm part of the on-call rotation, ensuring the reliability and availability of our services.`,
	},
	{
		title: "Senior Software Engineer",
		company: "Perk",
		logo: "/jobs/perk.png",
		url: "https://travelperk.com",
		period: "June 2019 - March 2020, November 2021 - April 2024",
		text: `I worked at Perk (TravelPerk at the time) as a senior full-stack software engineer, using React for frontend and Python with Django and Tornado for backend.
One of my significant contributions was a large effort transitioning the frontend codebase from JavaScript with Flow typing to TypeScript, enhancing maintainability and uncovering latent bugs.
I also contributed to shared backend projects, significantly improving developer experience and code quality. I actively participated in backend and frontend guilds to promote best practices among developers.
I was also involved in hiring and onboarding new people to the team, improving and refining processes and interviews.
I left to improve my work-life balance and rejoined when remote work became an option.`,
	},
	{
		title: "Senior Software Engineer",
		company: "Typeform",
		logo: "/jobs/typeform.png",
		url: "https://typeform.com",
		period: "March 2020 - November 2021",
		text: `I was the sole backend engineer in a team that was responsible for the form building aspect of the company.
My responsibilities included updating and maintaining several backend services, while also adding new features to enhance our offerings. Despite being primarily focused on backend development, I also contributed to parts of the frontend, ensuring a seamless user experience.
My efforts played a significant role in improving the developer experience and elevating the overall code quality.`,
	},
	{
		title: "Senior Software Engineer",
		company: "Socialpoint",
		logo: "/jobs/socialpoint.png",
		url: "https://www.socialpoint.es",
		period: "June 2012 - May 2019",
		text: `At Socialpoint I developed the server side of highly successful mobile games, catering to millions of daily active users. I worked in a 5-person team for 5 years and later in a 2-person team for a year.
One of my significant contributions was leading a project that introduced the first real-time backend part of our system developed in Go, and improving the continuous deployment strategy for real-time servers.
I encountered numerous challenges, primarily related to concurrency and high availability. I primarily used PHP (with Symfony) and Go in AWS.`,
	},
];
