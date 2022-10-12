module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserOpts: {
    headerPattern: /^(\w*)\((\w*)\)\s-(\w*)\s(.*)$/,
    headerCorrespondence: ['type', 'scope', 'ticket', 'subject'],
  },
  rules: {
    'subject-case': [2, 'always', ['sentence-case', 'start-case', 'pascal-case', 'upper-case', 'kebab-case']],
    'jira-ticket': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'jira-ticket': (config) => {
          const { subject } = config;

          return [subject?.match(/(\[[A-Z]+-[0-9]+\])\s(.*)/), `Your subject should contain the JIRA ticket`];
        },
      },
    },
  ],
};
