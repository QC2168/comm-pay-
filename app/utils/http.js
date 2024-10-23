const { createAlova } = require('alova');
const adapterFetch = require('alova/fetch');

const alova = createAlova({
  requestAdapter: adapterFetch(),
  responded: response => response.json()
});

module.exports=alova
