const isGithubActions = process.env.GITHUB_ACTIONS || false;

let config = {
  reactStrictMode: false,
  swcMinify: true,
};

if (isGithubActions) {
  config = {
    ...config,
    // eslint: {
    //     // Warning: This allows production builds to successfully complete even if
    //     // your project has ESLint errors.
    //     ignoreDuringBuilds: true,
    // },
  };
}

module.exports = config;
