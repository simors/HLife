/**
 * Created by yangyang on 2016/12/12.
 */
import AV from 'leancloud-storage'
import {Platform} from 'react-native'

export function uploadFile(payload) {
  try {
    let uri = payload.fileUri
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return uploadNetFile(payload)
    }
    return uploadLocalFile(payload)
  } catch (e) {
    console.log("uploadFile:", e)
  }
}

export function uploadLocalFile(payload) {
  let uri = payload.fileUri
  let file = new AV.File(payload.fileName, {blob: {uri}})
  return file.save().then(function (savedFile) {
    let saved = {
      savedPos: savedFile.attributes.url
    }
    return saved
  }, function (err) {
    throw err
  })
}

export function uploadNetFile(payload) {
  let uri = payload.fileUri
  let file = AV.File.withURL(payload.fileName, uri)
  return file.save().then(function (savedFile) {
    let saved = {
      savedPos: savedFile.attributes.url
    }
    return saved
  }, function (err) {
    throw err
  })
}

export function batchedUploadFiles(payload) {
  let uploadPromises = payload.uploadPayloads.map((item) => {
    return uploadFile(item)
  })

  return Promise.all(uploadPromises).then((savedList) => {
    return savedList
  }).catch((error) => {
    throw error
  })
}
