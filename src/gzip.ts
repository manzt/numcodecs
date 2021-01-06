import pako from 'pako';
import type { Codec, CodecConstructor } from './utils';

type ValidGZipLevelSetting = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface GZipConfig {
  level?: number;
}

const GZip: CodecConstructor<GZipConfig> = class GZip implements Codec {
  public static codecId = 'gzip';
  public level: ValidGZipLevelSetting;

  constructor(level = 1) {
    if (level < 0 || level > 9) {
      throw new Error('Invalid gzip compression level, it should be between 0 and 9');
    }
    this.level = level as ValidGZipLevelSetting;
  }

  static fromConfig({ level }: GZipConfig): GZip {
    return new GZip(level);
  }

  encode(data: Uint8Array): Uint8Array {
    const gzipped = pako.gzip(data, { level: this.level });
    return gzipped;
  }

  decode(data: Uint8Array, out?: Uint8Array): Uint8Array {
    const uncompressed = pako.ungzip(data);
    if (out !== undefined) {
      out.set(uncompressed);
      return out;
    }
    return uncompressed;
  }
};

export default GZip;
