// import express from 'express';
import { fetchMakes } from './services/xml-parser.service';

const main = async () => {
  const makes = await fetchMakes();
  console.log(makes.Response.Results);
};

main();
