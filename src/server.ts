import AppDataSource from './config/ormconfig'
import app from './app';
import config from './config';

const PORT = config.port || 3000;

let server: any;

const startServer = async () => {
  try {
    // 数据库连接
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    // 启动服务器
    server = app.listen(PORT, () => {
      console.log(`Server running on http://${config.host}:${PORT}`);
    });

    // 错误处理
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
      console.error('Server error:', error);
    });

  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

// 优雅退出处理
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  
  if (server) {
    server.close(() => {
      console.log('Server closed');
    });
  }

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('Database connection closed');
  }

  process.exit(0);
};

// 注册进程信号处理
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown();
});

// 启动服务器
startServer();
