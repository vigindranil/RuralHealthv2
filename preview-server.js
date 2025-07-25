import { preview } from 'vite';
preview({
  preview: {
    port: 3100,
    host: '0.0.0.0'  // Required for external access via Nginx
  }
});