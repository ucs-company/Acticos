module.exports = {
  apps: [
    {
      name: 'acticos-api',
      cwd: '/var/www/acticos/apps/api',
      script: 'src/server.js',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '400M',
      env: { NODE_ENV: 'production' },
      out_file: '/var/log/acticos/api.out.log',
      error_file: '/var/log/acticos/api.err.log',
      time: true,
    },
  ],
};
