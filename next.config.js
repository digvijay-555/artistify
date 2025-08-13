// next.config.js

const { sources } = require("next/dist/compiled/webpack/webpack");
const { headers } = require("next/headers");

module.exports = {
  headers: () => [
    {
      source: '/src/app',
      headers: [
        {
          key: 'cache-control',
          value: 'no-store'
        }
      ]
    }
  ],
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.js$/,
      include: /web3_contracts/,
      use: 'null-loader'
    });
    config.module.rules.push({
      test: /src\/testing\/page\.tsx$/,
      use: 'null-loader',
    });
    return config;
  },
  images: {
    domains: ['emerald-managerial-firefly-535.mypinata.cloud']
  }
};