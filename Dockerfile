# Set build
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy whole source code of project to working directory in container
COPY . .

# Build the app
RUN pnpm run build


# Production stage
FROM nginx:stable-alpine

# Copy built app from build stage to nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

# Set port 
EXPOSE 80

# Run nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
