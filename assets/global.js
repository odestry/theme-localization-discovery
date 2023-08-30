async function getLocalizationSuggestion() {
  const response = await fetch(`${window.Shopify.routes.root}browsing_context_suggestions.json?country[enabled]=true&country[exclude]=${window.Shopify.country}&language[enabled]=true&language[exclude]=${window.Shopify.language}`);
  const { detected_values, suggestions } = await response.json();

  const mapped_suggestions = suggestions.map(({ parts: { country, language } }) => ({
    country: country.handle,
    language: language.handle,
  }));

  return {
    detected_country: detected_values.country,
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

function updateRedirectLink ({ country }) {
  const redirectLink = document.querySelector('.localization-button');
  if (!redirectLink) return;
  redirectLink.textContent = `Shop ${country} store`
  // TODO: update the link to redirect to the correct country and language
}

async function showLocalizationSuggestion() {
  const { detected_country } = await getLocalizationSuggestion()

  if (detected_country) {
    document.querySelector('.localization-suggestion').innerHTML = `Shopify detected you are in <span class="font-semibold">${detected_country.name}</span>.`
    updateRedirectLink({ country: detected_country.name })
  }
}

showLocalizationSuggestion()
