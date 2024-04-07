<h1 align="center">
	<img alt="Logo" src="https://github.com/ViniciusHack/delivery-management-api/assets/60555584/47aef0e3-ecbb-42e5-ada5-fe416ec4910e" width="200px" />
</h1>

<h3 align="center">
Fast Feet API
</h3>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/ViniciusHack/delivery-management-api">

  <a href="https://www.linkedin.com/in/ViniciusHack/">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-Vinícius%20Hack-gree">
  </a>
  
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/ViniciusHack/delivery-management-api">
  
  <a href="https://github.com/ViniciusHack/fast-feet/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/ViniciusHack/delivery-management-api">
  </a>
</p>

<p align="center">
  <a href="#-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-features">Features</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>
</p>


## 👨🏻‍💻 About the project
**Fast Feet** is a delivery management API. Built based on this <a href="https://www.figma.com/file/hn0qGhnSHDVst7oaY3PF72/FastFeet">app design</a>
<br />
<br />
It's the last project and challenge from Ignite's course and the largest one too. In this project I could improve my skills in a lot of different technologie and concepts.
In spite of me not being or knowing someone that is an expert of this domain, I've tried to use experssions, terms that actually are used by this kind of business in real life.

## 🔨 Main Features
- Create and login with 2 types of users: Admins and Shippers.
- Shippers CRUD
- Addressees CUD
- Orders CRUD
- List orders from an addressee
- Release a order -> That point is when it turns into a "delivery"
- Pick up a delivery
- Deliver a delivery
- Return a delivery
- List deliveries from a shipper
- List deliveries nearby
- Notify addressee on delivery's stage change (Email)

## ✨ Main Concepts Worked
- Domain Driven Design (DDD), Clean Arch, SOLID and their patterns
  - Domain Modeling
  - Bounded contexts
  - Entities
  - Aggregates
  - Repositories
  - Value Objects
  - Domain Events
  - Factories
  - ...
- Authentication ([JWT](https://jwt.io/) with RS256) and RBAC (Role based access control)
- Caching ([Redis](https://redis.io/))
- External APIs communication
    - Mailing ([Resend](https://resend.com/overview) Free tier)
    - Geocoding ([GeoAPIFY](https://www.geoapify.com/geocoding-api/))
- Storaging ([Cloudflare R2/AWS S3](https://www.cloudflare.com/pt-br/developer-platform/r2/))
  - File uploading
- Testing (Unit and E2E)

## 🔧 Technologies
- NodeJS
- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Vitest
- Supertest
- FakerJS
- Zod
- IORedis
- BCrypt
- Axios
- AWS SDK / Client S3

## 💻 Getting started

### Requirements

- <a href="https://nodejs.org/en/">NodeJS</a>
- <a href="[https://classic.yarnpkg.com/lang/en/docs/install/](https://docs.docker.com/engine/install/)">Docker</a>

**Follow the steps below**

```bash
# Clone the project and access the folder
$ git clone https://github.com/ViniciusHack/delivery-management-api/ && cd delivery-management-api

# Install the dependencies
$ npm i

# Run containers
$ docker-compose up

# Note, before running the app, define your environment variables

# Start the client
$ npm run start:dev
```
---

Made with 💜 &nbsp;by Vinícius Hack 👋 &nbsp;[See my linkedin](https://www.linkedin.com/in/viniciushack/)
