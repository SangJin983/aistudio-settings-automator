import { DEFAULT_SETTINGS } from "./config.js";
import { Err, Ok } from "./railwayUtils.js";

export const loadSettings = async () => {
  try {
    const savedData = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    const fullSettings = { ...DEFAULT_SETTINGS, ...savedData };
    return Ok(fullSettings);
  } catch (error) {
    console.error("설정 불러오기 실패:", error);
    return Err(new Error("설정을 불러오는 중 에러가 발생했습니다."));
  }
};

export const saveSettings = async (settings) => {
  try {
    await chrome.storage.sync.set(settings);
    return Ok(true);
  } catch (error) {
    console.error("설정 저장 실패:", error);
    return Err(new Error("설정을 저장하는 중 에러가 발생했습니다."));
  }
};
