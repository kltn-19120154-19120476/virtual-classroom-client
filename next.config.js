const isGithubActions = process.env.GITHUB_ACTIONS || false;

let config = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    loader: "imgix",
    path: "https://kltn19120154-19120476.imgix.net",
  },
};

if (isGithubActions) {
  config = {
    ...config,
    basePath: "/virtual-classroom-client",
    async redirects() {
      return [
        {
          source: "/",
          destination: "/virtual-classroom-client",
          permanent: false,
          basePath: false,
        },
      ];
    },
    // eslint: {
    //     // Warning: This allows production builds to successfully complete even if
    //     // your project has ESLint errors.
    //     ignoreDuringBuilds: true,
    // },
  };
}

module.exports = config;
