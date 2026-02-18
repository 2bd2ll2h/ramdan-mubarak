FROM node:18-slim

WORKDIR /app

# نسخ ملفات التعريف أولاً لسرعة التحميل
COPY package*.json ./
RUN npm install

# نسخ باقي ملفات المشروع (src, public, index.html, إلخ)
COPY . .

# الخطوة السحرية: إنشاء مجلد dist داخل السيرفر
RUN npm run build

# تجهيز مجلد الرفع
RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 3000
CMD ["node", "server.js"]