// Genera iconos PNG placeholder (color sólido) para el manifest PWA.
// Reemplazar más adelante por iconos reales de diseño.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c
  }
  return table
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (const byte of buf) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function makePng(size, [r, g, b], radius = 0.18) {
  const rows = []
  const rad = Math.floor(size * radius)
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4)
    row[0] = 0
    for (let x = 0; x < size; x++) {
      const inCorner =
        (x < rad && y < rad && (x - rad) ** 2 + (y - rad) ** 2 > rad ** 2) ||
        (x >= size - rad && y < rad && (x - (size - rad)) ** 2 + (y - rad) ** 2 > rad ** 2) ||
        (x < rad && y >= size - rad && (x - rad) ** 2 + (y - (size - rad)) ** 2 > rad ** 2) ||
        (x >= size - rad && y >= size - rad && (x - (size - rad)) ** 2 + (y - (size - rad)) ** 2 > rad ** 2)
      const offset = 1 + x * 4
      if (inCorner) {
        row.writeUInt8(0, offset)
        row.writeUInt8(0, offset + 1)
        row.writeUInt8(0, offset + 2)
        row.writeUInt8(0, offset + 3)
      } else {
        row.writeUInt8(r, offset)
        row.writeUInt8(g, offset + 1)
        row.writeUInt8(b, offset + 2)
        row.writeUInt8(255, offset + 3)
      }
    }
    rows.push(row)
  }
  const raw = Buffer.concat(rows)
  const idat = deflateSync(raw)

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync('public/icons', { recursive: true })

const PURPLE = [124, 58, 237] // violet-600, acorde al acento de la app

writeFileSync('public/icons/icon-192.png', makePng(192, PURPLE, 0.18))
writeFileSync('public/icons/icon-512.png', makePng(512, PURPLE, 0.18))
// Maskable: sin transparencia en las esquinas (radius 0) para respetar el "safe zone"
writeFileSync('public/icons/icon-maskable-512.png', makePng(512, PURPLE, 0))

console.log('Iconos generados en public/icons/')
