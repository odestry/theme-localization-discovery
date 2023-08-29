async function getLocalizationSuggestion() {
  const response = await fetch(`${window.Shopify.routes.root}browsing_context_suggestions.json?country[enabled]=true&country[exclude]=${window.Shopify.country}&language[enabled]=true&language[exclude]=${window.Shopify.language}`);
  const { detected_values, suggestions } = await response.json();

  const mapped_suggestions = suggestions.map(({ parts: { country, language } }) => ({
    country: country.handle,
    language: language.handle,
  }));

  return {
    detected_country: detected_values.country_name,
    suggestions: mapped_suggestions,
  };
}

function updateLocalization({country, language}) {
  const formId = crypto.randomUUID();
  const formHtml = `
    <form id="${formId}" action="/localization" method="POST" hidden>
      <input name="_method" value="PUT">
      <input name="country_code" value="${country}">
      <input name="language_code" value="${language}">
    </form>
  `;
  document.body.insertAdjacentHTML("beforeend", formHtml);
  document.getElementById(formId).submit();
}

async function showLocalizationSuggestion() {
  const { detected_country } = await getLocalizationSuggestion()

  if (detected_country) {
    document.querySelector('.localization-suggestion').textContent = `Shopify detected you are in ${detected_country}.`
  }
}

showLocalizationSuggestion()
