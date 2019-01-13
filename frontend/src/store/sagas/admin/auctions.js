import { takeLatest } from 'redux-saga/effects'

import apiCall from 'store/api/call'
import {
  ADMIN_GET_AUCTION_LIST,
  ADMIN_CREATE_AUCTION,
  ADMIN_GET_AUCTION_DETAIL,
  ADMIN_UPDATE_AUCTION_DETAIL,
  ADMIN_START_AUCTION,
  ADMIN_FINISH_AUCTION,
  ADMIN_CANCEL_AUCTION,
} from 'store/constants'


const getAuctionList = apiCall({
  type: ADMIN_GET_AUCTION_LIST,
  method: 'get',
  path: 'admin/auctions/',
})

const createAuction = apiCall({
  type: ADMIN_CREATE_AUCTION,
  method: 'post',
  path: 'admin/auctions/',
})

const getAuctionDetail = apiCall({
  type: ADMIN_GET_AUCTION_DETAIL,
  method: 'get',
  path: ({ payload }) => `admin/auctions/${payload.id}/`,
})

const updateAuctionDetail = apiCall({
  type: ADMIN_UPDATE_AUCTION_DETAIL,
  method: 'put',
  path: ({ payload }) => `admin/auctions/${payload.id}/`,
})

const startAuction = apiCall({
  type: ADMIN_START_AUCTION,
  method: 'post',
  path: ({ payload }) => `admin/auctions/${payload.id}/start/`,
})

const finishAuction = apiCall({
  type: ADMIN_FINISH_AUCTION,
  method: 'post',
  path: ({ payload }) => `admin/auctions/${payload.id}/finish/`,
})

const cancelAuction = apiCall({
  type: ADMIN_CANCEL_AUCTION,
  method: 'post',
  path: ({ payload }) => `admin/auctions/${payload.id}/cancel/`,
})

export default function* rootSaga () {
  yield takeLatest(ADMIN_GET_AUCTION_LIST, getAuctionList)
  yield takeLatest(ADMIN_CREATE_AUCTION, createAuction)
  yield takeLatest(ADMIN_GET_AUCTION_DETAIL, getAuctionDetail)
  yield takeLatest(ADMIN_UPDATE_AUCTION_DETAIL, updateAuctionDetail)
  yield takeLatest(ADMIN_START_AUCTION, startAuction)
  yield takeLatest(ADMIN_FINISH_AUCTION, finishAuction)
  yield takeLatest(ADMIN_CANCEL_AUCTION, cancelAuction)
}