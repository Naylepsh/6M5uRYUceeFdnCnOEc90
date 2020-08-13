<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

## API

### Lecturers

- lecturers/ (GET)
- lecturers/ (POST) expects body of following format
  ```
  {
    "firstName": <some-string>,
    "lastName": <some-string>,
    "phoneNumber": <valid-in-polish-region-9-digits-no-other-characters>
    "email": <valid-email>,
    "groups": <array-of-group-ids>,
    "consultations": <array-of-consultation-ids>
  }
  ```
- lecturers/:`UUIDv4` (GET)
- lecturers/:`UUIDv4` (PUT)
  ```
  {
    "firstName": <some-string>,
    "lastName": <some-string>,
    "phoneNumber": <valid-in-polish-region-9-digits-no-other-characters>
    "email": <valid-email>,
    "groups": <array-of-group-ids>,
    "consultations": <array-of-consultation-ids>
  }
  ```
- lecturers/:`UUIDv4` (DELETE)

### Students

- students/ (GET)
- students/ (POST)
  ```
  {
    "firstName": <some-string>,
    "lastName": <some-string>,
    "groups": <array-of-group-ids>,
    "parents": <array-of-parent-ids>,
    "consultations": <array-of-consultation-ids>
  }
  ```
- students/:`UUIDv4` (GET)
- students/:`UUIDv4` (PUT)
  ```
  {
    "firstName": <some-string>,
    "lastName": <some-string>,
    "groups": <array-of-group-ids>,
    "parents": <array-of-parent-ids>,
    "consultations": <array-of-consultation-ids>
  }
  ```
- students/:`UUIDv4` (DELETE)

### Parents

- parents/ (GET)
- parents/ (POST)
  ```
  {
    "firstName": <some-string>,
    "lastName": <some-string>,
    "phoneNumber": <valid-in-polish-region-9-digits-no-other-characters>
    "email": <valid-email>,
    "children": <array-of-student-ids>
  }
  ```
- parents/:`UUIDv4` (GET)
- parents/:`UUIDv4` (PUT)
  ```
  {
    "firstName": <some-string>,
    "lastName": <some-string>,
    "phoneNumber": <valid-in-polish-region-9-digits-no-other-characters>
    "email": <valid-email>,
    "children": <array-of-student-ids>
  }
  ```
- parents/:`UUIDv4` (DELETE)

### Groups

- groups/ (GET)
- groups/ (POST)
  ```
  {
    "day": <some-string-(schema-not-yet-specified)>,
    "time": "hh:mm",
    "address": <some-string>,
    "startDate": "yyyy-mm-dd",
    "endDate": "yyyy-mm-dd",
    "lecturers": <array-of-lecturer-ids>,
    "students": <array-of-student-ids>
  }
  ```
- groups/:`UUIDv4` (GET)
- groups/:`UUIDv4` (PUT)
  ```
  {
    "day": <some-string-(schema-not-yet-specified)>,
    "time": "hh:mm",
    "address": <some-string>,
    "startDate": "yyyy-mm-dd",
    "endDate": "yyyy-mm-dd",
    "lecturers": <array-of-lecturer-ids>,
    "students": <array-of-student-ids>
  }
  ```
- groups/:`UUIDv4` (DELETE)

### Consultations

- consultations/ (GET)
  `supports '?between[]=<start-datetime>&between[]=<end-datetime>` query
- consultations/ (POST)
  ```
  {
    "datetime": <utc-datetime>,
    "address": <some-string>,
    "description": <some-string>,
    "lecturers": <array-of-lecturer-ids>,
    "students": <array-of-student-ids>
  }
  ```
- consultations/:`UUIDv4` (GET)
- consultations/:`UUIDv4` (PUT)
  ```
  {
    "datetime": <utc-datetime>,
    "address": <some-string>,
    "description": <some-string>,
    "lecturers": <array-of-lecturer-ids>,
    "students": <array-of-student-ids>
  }
  ```
- consultations/:`UUIDv4` (DELETE)
