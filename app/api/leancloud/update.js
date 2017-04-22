/**
 * Created by lilu on 2017/4/22.
 */
import AV from 'leancloud-storage'

export function checkUpdate() {
  let query = new AV.Query('AppVersion')
  query.descending('version')
  return query.first().then((result)=>{
    let version={
      version:result.attributes.version,
      fileUrl:result.attributes.fileUrl
    }
    // console.log('version',version)

    return version
  })
}