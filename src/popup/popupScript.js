import { loadSettings, saveSettings } from "../shared/storageService.js";

// --- DOM 요소 캐싱 ---
const tempInput = document.getElementById("temperature");
const searchToggle = document.getElementById("enableGoogleSearch");
const urlToggle = document.getElementById("enableUrlContext");
const saveButton = document.getElementById("saveButton");
const statusEl = document.getElementById("status");

async function restoreOptions() {
  const result = await loadSettings();

  result
    .tap((settings) => {
      tempInput.value = settings.temperature;
      searchToggle.checked = settings.enableGoogleSearch;
      urlToggle.checked = settings.enableUrlContext;
    })
    .tapErr((error) => {
      statusEl.textContent = `Error: ${error.message}`;
    });
}

function saveOptions() {
  const settings = {
    temperature: parseFloat(tempInput.value),
    enableGoogleSearch: searchToggle.checked,
    enableUrlContext: urlToggle.checked,
  };

  saveSettings(settings).then((result) => {
    if (result.isSuccess()) {
      statusEl.textContent = "설정이 저장되었습니다!";
      setTimeout(() => {
        statusEl.textContent = "";
      }, 1500);
    } else {
      statusEl.textContent = `Error: ${result.unwrap().message}`;
    }
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
saveButton.addEventListener("click", saveOptions);
