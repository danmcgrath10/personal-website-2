export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Experience", link: "#experience" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "I prioritize clean, efficient, and well-documented code",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b2.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm flexible and can adapt to any situation or work environment",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "Currently working on this website",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "Locorum - DEVIL-TECH's Situational Awareness System",
    des: "A JavaFX cross-platform native desktop application that provides situational awareness and geographic information system capabilities for emergency services.",
    img: "/devil-tech-locorum-shot.png",
    iconLists: ["/java.png","ICON-GRADLE_CMYK.svg"],
  },
];

export const companies = [
  {
    id: 1,
    name: "MEDITECH",
    img: "",
    nameImg: "/meditech-logo.svg",
  },
  {
    id: 2,
    name: "WHOOP",
    img: "",
    nameImg: "/whoop-logo-white.svg",
  },
  {
    id: 3,
    name: "Criteo",
    img: "",
    nameImg: "/criteo-logo-white.svg",
  },
  {
    id: 4,
    name: "DEVIL-TECH",
    img: "devil-tech-logo.svg",
    nameImg: "",
  }
];

export const workExperience = [
  {
    id: 1,
    title: "Co-op Programmer",
    desc: "Developed VS Code extension for React Native, streamlining component integration and reducing coding requirements, enhancing developer efficiency.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Co-op Web Developer",
    desc: "Created multiple web applications to enhance team productivity: 1) An internal membership services portal that reduced manual management efforts and integrated with Stripe for efficient operations. 2) A dashboard and tools for the signal processing and field testing teams, improving workflow accessibility and data insights. Followed Scrum methodologies to ensure agile, on-time project delivery.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Part-time Developer",
    desc: "Rearchitected and rewrote JavaFX application that became the primary tool for product simulation testing, streamlining the testing process.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Part-time Sofware Development Intern",
    desc: "Contributed to a team developing a gamified ad experience browser extension using Angular and ASP.NET, focusing on optimizing project timelines and enhancing user engagement. Ensured alignment with company technology standards.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
  {
    id: 5,
    title: "Software Development Engineer",
    desc: "Collaborated in a team to enhance analytics dashboards, deploying scalable clusters with Apache Spark. Integrated Hive and Vertica, improving data sorting and processing speeds, enhancing dashboard functionality.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
  {
    id: 6,
    title: "Lead Software Developer",
    desc: "Introduced new features including dynamic data filtering, satellite tracking functionality, and additional radio interfaces, expanding the application’s data handling and communication capabilities.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    url: "https://github.com/danmcgrath10",
    alt: "githubUrl",
  },
  {
    id: 2,
    img: "/link.svg",
    url: "https://www.linkedin.com/in/mcgrath-daniel-e/",
    alt: "linkedinUrl",
  },
];