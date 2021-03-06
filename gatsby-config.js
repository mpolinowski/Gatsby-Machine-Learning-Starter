module.exports = {
  siteMetadata: {
    title: ' Dan Shai ',
    year: ' 2018 ',
  },
  pathPrefix: '/Gatsby-Machine-Learning-Starter',
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    'gatsby-remark-copy-linked-files',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-graph',
            options: {
              // this is the language in your code-block that triggers mermaid parsing
              language: 'mermaid', // default
              theme: 'default', // could also be dark, forest, or neutral
            },
          },
          `gatsby-remark-katex`,
        ],
      },
    },
    {
      resolve: `gatsby-transformer-csv`,
      options: {
        noheader: true,
      },
    },
  ],
}
