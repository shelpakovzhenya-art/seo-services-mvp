FROM node:22-bookworm-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PATH="/opt/venv/bin:$PATH"

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-dejavu-core \
    fonts-liberation2 \
    openssl \
    python3 \
    python3-pip \
    python3-venv \
  && rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/venv

COPY package*.json ./
COPY prisma ./prisma
COPY requirements.txt ./requirements.txt

RUN npm ci
RUN pip install -r requirements.txt

COPY . .

RUN npm run build

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "start"]
