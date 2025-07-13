import { loadSettings } from "../shared/storageService.js";
import { SELECTORS } from "../shared/config.js";
import { Ok, Err } from "../shared/railwayUtils.js";

/**
 * 특정 요소가 DOM에 나타날 때까지 기다리는 Promise를 반환합니다.
 * @param {string} selector - 기다릴 요소의 CSS 선택자
 * @returns {Promise<HTMLElement>} 요소가 찾아지면 resolve되는 Promise
 */
function waitForElement(selector) {
  return new Promise(resolve => {
    // 일단 바로 찾아봅니다. 이미 요소가 있을 수도 있습니다.
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    // 요소가 없다면, MutationObserver를 설정하여 DOM의 변화를 감시합니다.
    const observer = new MutationObserver(mutations => {
      const targetElement = document.querySelector(selector);
      if (targetElement) {
        observer.disconnect(); // 요소를 찾았으니 감시를 중단합니다.
        resolve(targetElement);
      }
    });

    // body 전체의 자식 요소 추가/삭제를 감시하도록 옵션을 설정합니다.
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

function runIndependentTasks(tasks) {
  const results = tasks.map((task) => task());
  const failures = results.filter((r) => r.isFailure());

  if (failures.length > 0) {
    const errors = failures.map((f) => {
      try {
        f.unwrap();
      } catch (e) {
        return e;
      }
    });
    return Err(errors);
  }

  const successes = results.map((r) => r.unwrap());
  return Ok(successes);
}

/**
 * CSS 선택자를 이용해 페이지에서 DOM 요소를 찾습니다.
 * @param {string} selector - 찾을 요소의 CSS 선택자
 * @returns {Result<HTMLElement>} 성공 시 DOM 요소를, 실패 시 에러를 담은 Result
 */
function findElement(selector) {
  const element = document.querySelector(selector);
  return element
    ? Ok(element)
    : Err(new Error(`'${selector}' 요소를 찾을 수 없습니다.`));
}

/**
 * 숫자 입력(input[type=number]) 또는 레인지 슬라이더(input[type=range])의 값을 설정합니다.
 * @param {HTMLElement} element - 값을 설정할 input 요소
 * @param {number} value - 설정할 숫자 값
 * @returns {Result<HTMLElement>} 항상 성공 Result를 반환
 */
function applyInputValue(element, value) {
  element.value = value;
  // AI Studio가 리액트 같은 프레임워크로 만들어졌을 가능성이 높으므로,
  // 값만 바꾸는 것만으로는 상태가 업데이트되지 않을 수 있습니다.
  // 'input' 이벤트를 강제로 발생시켜 프레임워크가 변화를 감지하도록 합니다.
  element.dispatchEvent(new Event("input", { bubbles: true }));
  return Ok(element);
}

/**
 * 토글 스위치(button[role=switch])의 상태를 설정합니다.
 * @param {HTMLElement} element - 상태를 설정할 button 요소
 * @param {boolean} shouldBeEnabled - 토글이 활성화되어야 하는지 여부
 * @returns {Result<HTMLElement>} 항상 성공 Result를 반환
 */
function applyToggleState(element, shouldBeEnabled) {
  const isCurrentlyEnabled = element.getAttribute("aria-checked") === "true";

  // 현재 상태와 원하는 상태가 다를 경우에만 클릭하여 상태를 변경합니다.
  if (isCurrentlyEnabled !== shouldBeEnabled) {
    element.click();
  }
  return Ok(element);
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log("AI Studio 설정 자동화 스크립트 실행됨. DOM 요소들을 기다립니다...");

  const tempInputResult = await waitForElement(SELECTORS.temperatureInput).then(Ok).catch(Err);
  const searchToggleResult = await waitForElement(SELECTORS.googleSearchToggle).then(Ok).catch(Err);
  const urlToggleResult = await waitForElement(SELECTORS.urlContextToggle).then(Ok).catch(Err);

  const settingsResult = await loadSettings();

  settingsResult
    .andThen(settings => {
      const tasks = [
        () => tempInputResult.andThen(input => applyInputValue(input, settings.temperature)),
        () => searchToggleResult.andThen(toggle => applyToggleState(toggle, settings.enableGoogleSearch)),
        () => urlToggleResult.andThen(toggle => applyToggleState(toggle, settings.enableUrlContext))
      ];
      return runIndependentTasks(tasks);
    })
    .tap(successes => {
      console.log('모든 설정이 성공적으로 적용되었습니다.');
    })
    .tapErr(errors => {
      console.warn('일부 설정 적용 실패:');
      if (Array.isArray(errors)) {
        errors.forEach(error => console.warn(`- ${error.message || error}`));
      } else {
        console.warn(`- ${errors.message || errors}`);
      }
    });
}


// 스크립트 실행
main();
