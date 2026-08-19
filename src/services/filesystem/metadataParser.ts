import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {log} from '@utils/logger';

/**
 * Self-contained, fully-offline ID3v2 tag reader.
 *
 * We read only the leading bytes of each file (the ID3 header lives at the top),
 * decode the frames we care about, and bail early. This avoids pulling an
 * unstable native tag library while staying 100% offline. Files without ID3
 * tags fall back to filename-derived metadata in the scanner.
 *
 * Supports ID3v2.3 and v2.4 text frames (TIT2/TPE1/TALB/TRCK/TCON) plus the
 * APIC artwork frame, which artworkExtractor consumes.
 */

export interface ParsedMetadata {
  title?: string;
  artist?: string;
  album?: string;
  genre?: string;
  trackNumber?: number;
  /** Raw APIC image bytes + mime, if present. */
  artwork?: {data: Buffer; mime: string};
}

const TEXT_FRAMES: Record<string, keyof ParsedMetadata> = {
  TIT2: 'title',
  TPE1: 'artist',
  TALB: 'album',
  TCON: 'genre',
  TRCK: 'trackNumber',
};

/** Decode a synchsafe 28-bit integer (ID3v2 size encoding). */
function readSynchsafe(buf: Buffer, offset: number): number {
  return (
    (buf[offset] << 21) |
    (buf[offset + 1] << 14) |
    (buf[offset + 2] << 7) |
    buf[offset + 3]
  );
}

function decodeTextFrame(body: Buffer): string {
  if (body.length === 0) {
    return '';
  }
  const encoding = body[0];
  const content = body.slice(1);
  // 0 = ISO-8859-1, 1 = UTF-16 w/ BOM, 2 = UTF-16BE, 3 = UTF-8
  switch (encoding) {
    case 0:
      return content.toString('latin1').replace(/\0+$/, '');
    case 1:
    case 2:
      return content.toString('utf16le').replace(/\0+$/, '');
    case 3:
    default:
      return content.toString('utf8').replace(/\0+$/, '');
  }
}

function parseAPIC(body: Buffer): {data: Buffer; mime: string} | undefined {
  // Layout: [encoding:1][mime:null-terminated][picType:1][desc:null-term][image]
  let cursor = 1;
  const mimeEnd = body.indexOf(0x00, cursor);
  if (mimeEnd < 0) {
    return undefined;
  }
  const mime = body.slice(cursor, mimeEnd).toString('latin1') || 'image/jpeg';
  cursor = mimeEnd + 1;
  cursor += 1; // picture type byte
  // description is null-terminated (1 or 2 bytes depending on encoding; assume 1)
  const descEnd = body.indexOf(0x00, cursor);
  if (descEnd < 0) {
    return undefined;
  }
  const data = body.slice(descEnd + 1);
  return {data, mime};
}

export async function parseMetadata(
  filePath: string,
): Promise<ParsedMetadata> {
  const result: ParsedMetadata = {};
  try {
    // Read first 256KB — large enough to hold tags + embedded artwork.
    const HEADER_BYTES = 256 * 1024;
    const base64 = await RNFS.read(filePath, HEADER_BYTES, 0, 'base64');
    const buf = Buffer.from(base64, 'base64');

    if (buf.length < 10 || buf.toString('latin1', 0, 3) !== 'ID3') {
      return result; // no ID3v2 tag
    }

    const tagSize = readSynchsafe(buf, 6);
    const end = Math.min(10 + tagSize, buf.length);
    let cursor = 10;

    while (cursor + 10 <= end) {
      const frameId = buf.toString('latin1', cursor, cursor + 4);
      if (!/^[A-Z0-9]{4}$/.test(frameId)) {
        break; // padding reached
      }
      // v2.4 uses synchsafe frame sizes; v2.3 uses plain. Detect via version byte.
      const version = buf[3];
      const frameSize =
        version === 4
          ? readSynchsafe(buf, cursor + 4)
          : buf.readUInt32BE(cursor + 4);
      const bodyStart = cursor + 10;
      const body = buf.slice(bodyStart, bodyStart + frameSize);

      if (frameId === 'APIC') {
        result.artwork = parseAPIC(body);
      } else if (TEXT_FRAMES[frameId]) {
        const value = decodeTextFrame(body).trim();
        if (frameId === 'TRCK') {
          const n = parseInt(value.split('/')[0], 10);
          if (!Number.isNaN(n)) {
            result.trackNumber = n;
          }
        } else if (value) {
          (result as Record<string, unknown>)[TEXT_FRAMES[frameId]] = value;
        }
      }

      cursor = bodyStart + frameSize;
    }
  } catch (err) {
    log.warn('fs', 'metadata parse failed', filePath, err);
  }
  return result;
}
