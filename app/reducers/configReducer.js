import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {Config, BannerItemConfig} from '../models/ConfigModels'

const initialState = initConfig({
  banners: {
    home: [
      {
        image: 'http://www.qq745.com/uploads/allimg/141106/1-141106153Q5.png',
      },
      {
        image: 'http://img1.3lian.com/2015/a1/53/d/200.jpg',
      },
      {
        image: 'http://img1.3lian.com/2015/a1/53/d/198.jpg',
      },
      {
        image: 'http://img1.3lian.com/2015/a1/53/d/200.jpg',
      }
    ]
  }
})

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}

function initConfig(payload) {
  let record = Config()
  if(payload) {
    record = record.withMutations((config) => {
      if(payload.banners) {
        config.set('banners', initBanners(payload.banners))
      }
    })
  }
  return record
}

function initBanners(banners) {
  let bannerMap = new Map()
  for(let type in banners) {
    bannerMap = bannerMap.set(type, initBanner(banners[type]))
  }
  return bannerMap
}

function initBanner(banner) {
  let bannerItems = []
  banner.map((bannerItem) => {
    bannerItems.push(new BannerItemConfig(bannerItem))
  })
  return new List(bannerItems)
}

function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  return incoming
}