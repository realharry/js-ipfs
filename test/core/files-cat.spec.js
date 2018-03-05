/* eslint max-nested-callbacks: ['error', 8] */
/* eslint-env mocha */
'use strict'

const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const isNode = require('detect-node')
// const codecs = require('multicodec/src/base-table')
// const multihashing = require('multihashing')
// const CID = require('cids')
const IPFS = require('../../src/core')

// This gets replaced by `create-repo-browser.js` in the browser
const createTempRepo = require('../utils/create-repo-nodejs.js')

const content = 'Hello files.cat!'

describe('files cat', () => {
  if (!isNode) { return }

  let ipfs
  let repo
  let path
  // let cid

  beforeEach(() => {
    repo = createTempRepo()

    ipfs = new IPFS({
      repo: repo,
      init: true,
      start: true
    })

    ipfs.on('start', () => {
      let buffer = Buffer.from(content)
      // const version = 1
      // const codec = 'dag-cbor'
      // const mh = multihashing(buffer, 'sha2-256')
      // cid = new CID(version, codec, mh)
      ipfs.files.add(buffer, {}, (err, filesAdded) => {
        expect(err).to.not.exist()
        path = filesAdded[0].path
        console.log('Created: path = ' + path)
      })
    })
  })

  afterEach(function (done) {
    this.timeout(16 * 1000)
    ipfs.stop(done)
    // setTimeout(() => {
    //   ipfs.stop(done)
    //   // done()
    // }, 8 * 1000)
  })

  it('ipfsPath = path string', (done) => {
    setTimeout(() => {
      console.log('Reading: path = ' + path)
      expect(path).to.exist()
      ipfs.files.cat(path, (err, data) => {
        expect(err).to.not.exist()

        expect(data.toString('utf8')).to.equals(content)
        done()
      })
    }, 10 * 1000)
  }).timeout(20 * 1000)

  // Bug #1247
  // it('ipfsPath = cid buffer', (done) => {
  //   setTimeout(() => {
  //     console.log('Reading: cid = ')
  //     console.log(cid)
  //     console.log(cid.buffer)
  //     expect(cid.buffer).to.exist()
  //     ipfs.files.cat(cid.buffer, (err, data) => {
  //       console.log(err)
  //       // expect(err).to.not.exist()
  //       console.log(data)
  //       // expect(data.toString('utf8')).to.equals(content)
  //       done()
  //     })
  //   }, 10 * 1000)
  // }).timeout(30 * 1000)

  // Bug #1247
  // it('ipfsPath = cid base58btc', (done) => {
  //   setTimeout(() => {
  //     console.log('Reading: cid = ')
  //     console.log(cid)
  //     let base58btc = cid.toBaseEncodedString()
  //     console.log(base58btc)
  //     expect(base58btc).to.exist()
  //     ipfs.files.cat(base58btc, (err, data) => {
  //       console.log(err)
  //       // expect(err).to.not.exist()
  //       console.log(data)
  //       // expect(data.toString('utf8')).to.equals(content)
  //       done()
  //     })
  //   }, 10 * 1000)
  // }).timeout(60 * 1000)
})
