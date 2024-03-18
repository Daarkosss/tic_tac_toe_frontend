# Etap budowania
FROM node:18-alpine as build

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj pliki projektu
COPY package.json pnpm-lock.yaml ./

# Zainstaluj zależności
RUN npm install -g pnpm && pnpm install

COPY . .

# Zbuduj aplikację na produkcję
RUN pnpm run build

# Etap produkcyjny
FROM nginx:stable-alpine

# Skopiuj zbudowaną aplikację z etapu budowania do katalogu serwera nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

# Ustaw port, na którym nginx będzie nasłuchiwał
EXPOSE 80

# Uruchom nginx w tle
CMD ["nginx", "-g", "daemon off;"]
