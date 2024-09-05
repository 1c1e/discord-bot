module.exports = {
  apps: [
    {
      name: 'Discord.JS Bot',
      script: 'pnpm',
      args: 'run start',
      time: true,
      exp_backoff_restart_delay: '100',
    },
  ],
};
