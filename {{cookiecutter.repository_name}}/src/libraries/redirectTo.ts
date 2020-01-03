import Router from 'next/router';

import { BASE_URL } from '../constants/routes';
import { HttpStatus } from '../constants/http-status';

export default (destination: any, { res, status }: any = {}) => {
  if (res) {
    res.writeHead(status || HttpStatus.FOUND, { Location: destination });
    res.end();
  } else if (destination[0] === BASE_URL && destination[1] !== BASE_URL) {
    Router.push(destination);
  } else {
    window.location = destination;
  }
};
