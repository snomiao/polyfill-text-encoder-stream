// index.ts
class TextEncoderStream {
  _encoder = new TextEncoder;
  _reader = null;
  ready = Promise.resolve();
  closed = false;
  readable = new ReadableStream({
    start: (controller) => {
      this._reader = controller;
    }
  });
  writable = new WritableStream({
    write: async (chunk) => {
      if (chunk != null && this._reader) {
        const encoded = this._encoder.encode(chunk);
        this._reader.enqueue(encoded);
      }
    },
    close: () => {
      this._reader?.close();
      this.closed = true;
    },
    abort: (reason) => {
      this._reader?.error(reason);
      this.closed = true;
    }
  });
}
export {
  TextEncoderStream as default
};
