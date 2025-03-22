module.exports = {
  apps: [
    {
      name: 'my-app',
      script: 'index.js', // Relative path naar het startscript
      instances: '1', // Dynamisch aantal instanties gebaseerd op CPU's
      exec_mode: 'cluster', // Cluster mode voor load balancing
      watch: true,
      ignore_watch: ['.git', 'node_modules', 'logs', "databases","social_log"], // Voorkomen dat deze paden worden gevolgd
      max_memory_restart: '500M', // Herstart als geheugenlimiet wordt bereikt
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 80,
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z', // Datumformattering voor logs
      merge_logs: true, // Alle logs in één bestand
      restart_delay: 5000, // Wachten met herstarten na een crash
      post_update: ['npm install', 'pm2 restart my-app'], // Post-update acties
    },
  ],
  // Logrotatie toegevoegd voor beheer
  logrotate: {
    max_size: '10M',
    retain: 30, // Bewaar logbestanden voor 30 dagen
    compress: true, // Comprimeer oude logs
    dateFormat: 'YYYY-MM-DD_HH-mm-ss',
    workerInterval: 60, // Controleer elke minuut op logrotatie
  },
};
