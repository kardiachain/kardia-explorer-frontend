const LOCAL_STORAGE_KEY = 'kardia_local_cache'
const DEFAULT_TTL = Number(process.env.REACT_APP_DEFAULT_TTL);

const getLocalStorageObj = (): Record<string, any> | null => {
  const value = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (value === null) return value
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error('Invalid local cache');
  }
}

const setLocalStorageObj = (obj: Record<string, any>) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(obj));
}

const getCache = (key: string) => {
  const cacheObj = getLocalStorageObj()
  if (!cacheObj) return cacheObj
  try {
    const cacheItem = cacheObj[key]
    if (!cacheItem) return cacheItem
    if (cacheItem.createdAt + cacheItem.ttl < Date.now()) {
      delete cacheObj[key]
      return null
    }
    return cacheObj[key].value
  } catch (error) {
    throw new Error('Invalid local cache');
  }
};

const clearCache = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, '{}')
}

const deleteCache = (key: string) => {
  const cacheObj = getLocalStorageObj()
  if (!cacheObj) return true
  try {
    delete cacheObj[key]
    setLocalStorageObj(cacheObj);
    return true
  } catch (error) {
    throw new Error('Invalid local cache key');
  }
}

const setCache = (key: string, value: any, ttl?: number) => {
  let cacheObj = getLocalStorageObj()
  if (!cacheObj) {
    cacheObj = {}
  }
  const _ttl = ttl || DEFAULT_TTL;
  cacheObj[key] = {value, ttl: _ttl, createdAt: Date.now()}
  setLocalStorageObj(cacheObj);
  return true;
}

export {getCache, clearCache, deleteCache, setCache}