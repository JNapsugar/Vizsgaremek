
const { TextEncoder, TextDecoder } = require('text-encoding');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.alert = jest.fn();
global.location = {
  reload: jest.fn()
};