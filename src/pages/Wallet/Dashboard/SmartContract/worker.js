// import importScripts from 'import-scripts'

// export default () => {
console.log('in worker');

    // importScripts(['https://solc-bin.ethereum.org/emscripten-wasm32/solc-emscripten-wasm32-latest.js'])

    // // let version = Module.cwrap('solidity_version', 'string', []);
    // // postMessage({version: version()});
    // // let compile = Module.cwrap('solidity_compile', 'string', ['string', 'number', 'number']);

    // window.addEventListener('message', (event) => {
    //     console.log('event', event.data);
    //     // postMessage({ result: compile(event.data, 0, 0) })
    // })

    onmessage = function(e) {
        console.log('Message received from main script');
        window.postMessage('Message from worker');
      }

// }

export default {}
