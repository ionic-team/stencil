import { d as data } from './external-data.js';

function store() {
  return {
    data: data(),
  };
}

export { store as s };
