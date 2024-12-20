export default class PolyfillTextEncoderStream {
  // @builder.io/qwik-city/middleware/bun
  // still missing from bun: last check was bun version 1.1.8
  private _encoder = new TextEncoder();
  private _reader: ReadableStreamDefaultController<any> | null = null;
  public ready = Promise.resolve();
  public closed = false;
  public readable = new ReadableStream<Uint8Array>({
    start: (controller) => {
      this._reader = controller;
    },
  });
  public writable = new WritableStream<Uint8Array | string>({
    write: async (chunk) => {
      if (typeof chunk !== "string") {
        this._reader!.enqueue(chunk);
        return;
      }
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
    },
  });
}
