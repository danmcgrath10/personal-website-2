// The single source for Quick and game text. Only add facts Danny has confirmed.
export const site = {
  name: "Daniel McGrath",
  headline: "Software engineer based in Boston, MA",
  summary:
    "I'm a full-stack and backend software engineer. I work mostly with Java and React, with hands-on experience in JavaFX, Next.js, Docker, and AWS.",
  experience: [
    {
      title: "Software Engineer II",
      company: "Klaviyo",
      dates: "Oct 2025 to present",
      location: "Boston, MA",
      summary:
        "Full-stack work on Klaviyo's social channel, connecting Instagram DMs and other social touchpoints to the platform.",
    },
    {
      title: "Software Developer",
      company: "DeVil-Tech",
      dates: "Oct 2022 to Aug 2025",
      location: "Stafford, VA",
      summary:
        "Built a segmented thread-pooling system that eliminated UI freezes, re-architected the messaging backend, and added 3D tracking of orbital objects and vessels.",
    },
    {
      title: "Software Dev Engineer",
      company: "Criteo",
      dates: "Jan 2022 to Oct 2022",
      location: "Boston, MA",
      summary:
        "Enhanced analytics dashboards using Apache Spark, Hive, and Vertica.",
    },
    {
      title: "Part-time Software Developer Intern",
      company: "Criteo",
      dates: "Aug 2021 to Jan 2022",
      location: "Boston, MA",
      summary:
        "Built a browser extension in Angular and ASP.NET for a gamified online advertising experience.",
    },
    {
      title: "Part-time Junior Software Developer",
      company: "DeVil-Tech",
      dates: "Jul 2021 to Jan 2022",
      location: "",
      summary:
        "Developed commercial and defense software using Iridium SATCOM, NMEA 183 and AIS messaging, and GIS capabilities.",
    },
    {
      title: "Co-op Web Developer",
      company: "WHOOP",
      dates: "Jan 2020 to Aug 2020",
      location: "Boston, MA",
      summary:
        "Built a React user portal with Stripe and a Java Spring backend, plus internal data tools and monitoring.",
    },
    {
      title: "Co-op Programmer",
      company: "MEDITECH",
      dates: "Jan 2019 to Aug 2019",
      location: "Westwood, MA",
      summary:
        "Developed a VS Code extension for scaffolding React Native code, and helped publish Angular libraries to npm.",
    },
  ],
  projects: [
    {
      title: "FabCutie",
      summary:
        "A free, open-source parametric EQ for macOS and Windows in AU, VST3, CLAP, and standalone formats, with up to 24 bands, dynamic and spectral processing, EQ Match, and auto-unmasking between instances.",
      url: "https://github.com/danmcgrath10/fabcutie",
    },
    {
      title: "Home LLM Server",
      summary:
        "An always-on Mac Studio that runs local models through Ollama, with a small MCP server that lets Claude hand off drafting, search, and transcription to them.",
      url: "",
    },
    {
      title: "EarGoo",
      summary:
        "A web-based audio visualizer with real-time frequency analysis, built with Next.js and Supabase.",
      url: "https://github.com/danmcgrath10/audio-visualizer",
    },
    {
      title: "SubTrack",
      summary:
        "A subscription tracking and management API with automated reminders, built with Node.js, Express, and MongoDB.",
      url: "https://github.com/danmcgrath10/subtrack",
    },
    {
      title: "Cyclora",
      summary:
        "A React Native cycling tracker with GPS rides, local storage, and AI ride summaries.",
      url: "https://github.com/danmcgrath10/cyclora",
    },
    {
      title: "Locorum",
      summary:
        "A JavaFX cross-platform desktop application at DeVil-Tech that provides situational awareness and geographic information system capabilities for emergency services.",
      url: "",
    },
  ],
  education: "BS in Computer Engineering, Northeastern University, 2017 to Dec 2021",
  interests: "Music production and mead brewing",
  links: [
    { label: "GitHub", url: "https://github.com/danmcgrath10" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/mcgrath-daniel-e/" },
    { label: "Email", url: "mailto:danmcgrath1035@gmail.com" },
  ],
  game: {
    title: "Daniel's Workshop",
    loading: "Opening the workshop...",
    loadError: "The workshop wouldn't open on this device.",
    introKeyboard: "Walk with the arrow keys or WASD. Press E to look at things.",
    introTouch: "Tap to walk. Tap something to look at it.",
    quickLabel: "Quick version",
    closeLabel: "Close",
    lookAt: "Look at the",
    foundLabel: "found",
    finishedTitle: "That's the whole workshop!",
    finishedLine: "Thanks for looking around. Here's where to find me.",
    objects: [
      {
        id: "computer",
        name: "computer",
        line: "The monitor's still warm. By day I'm a Software Engineer II at Klaviyo, doing full-stack work on its social channel and connecting Instagram DMs to the platform.",
        links: [],
      },
      {
        id: "mixer",
        name: "mixing desk",
        line: "This is where FabCutie gets tested. It's the free, open-source parametric EQ I built for macOS and Windows.",
        links: [{ label: "FabCutie on GitHub", url: "https://github.com/danmcgrath10/fabcutie" }],
      },
      {
        id: "mead",
        name: "mead shelf",
        line: "Outside of work, music production and mead brewing keep me busy. These bottles are the delicious half of that.",
        links: [],
      },
      {
        id: "books",
        name: "bookshelf",
        line: "A shelf full of old textbooks. I earned my BS in Computer Engineering at Northeastern University, finishing in December 2021.",
        links: [],
      },
      {
        id: "door",
        name: "front door",
        line: "Heading out? You can find me on GitHub and LinkedIn, or send me an email.",
        links: [
          { label: "GitHub", url: "https://github.com/danmcgrath10" },
          { label: "LinkedIn", url: "https://www.linkedin.com/in/mcgrath-daniel-e/" },
          { label: "Email", url: "mailto:danmcgrath1035@gmail.com" },
        ],
      },
    ],
  },
};
