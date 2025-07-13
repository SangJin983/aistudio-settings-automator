export const SELECTORS = Object.freeze({
  temperatureSlider: '[data-test-id="temperatureSliderContainer"] input[type="range"]',
  temperatureInput: '[data-test-id="temperatureSliderContainer"] input[type="number"]',
  googleSearchToggle: '[data-test-id="searchAsAToolTooltip"] button[role="switch"]',
  urlContextToggle: '[data-test-id="browseAsAToolTooltip"] button[role="switch"]',
});

export const DEFAULT_SETTINGS = Object.freeze({
  temperature: 0.7,
  enableGoogleSearch: true,
  enableUrlContext: true,
});