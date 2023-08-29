async function getLocalizationSuggestion() {
  const response = await fetch(
    window.Shopify.routes.root
      + 'browsing_context_suggestions.json'
      + '?country[enabled]=true'
      + `&country[exclude]=${window.Shopify.country}`
      + '&language[enabled]=true'
      + `&language[exclude]=${window.Shopify.language}`
  )
  return await response.json()
}

function updateLocalization({country, language}) {
  const formId = 'some-id';
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

(async () => {
  const { detected_values } = await getLocalizationSuggestion()
  const { country_name } = detected_values
  if (country_name) {
    document.querySelector('.localization-suggestion').innerHTML = `Shopify detected you are in ${country_name}.`
  }
})()
