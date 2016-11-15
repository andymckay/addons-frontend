import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

import { search } from 'core/api';
import { searchStart, searchLoad, searchFail } from 'core/actions/search';


export const paramsToFilter = {
  app: 'clientApp',
  category: 'category',
  q: 'query',
  type: 'addonType',
};

export function makeFilters(params) {
  const foundKeys = Object.keys(paramsToFilter).filter((key) => (
    typeof params[key] !== 'undefined' && params[key] !== ''
  ));

  return foundKeys.reduce((object, key) => (
    { ...object, [paramsToFilter[key]]: params[key] }
  ), {});
}

export function makeQueryParams(filters) {
  const foundValues = Object.keys(paramsToFilter).filter((key) => (
    typeof filters[paramsToFilter[key]] !== 'undefined' &&
      filters[paramsToFilter[key]] !== ''
  ));

  return foundValues.reduce((object, key) => (
    { ...object, [key]: filters[paramsToFilter[key]] }
  ), {});
}

export function mapStateToProps(state, ownProps) {
  const { location } = ownProps;

  const filters = makeFilters({
    ...location.query,
    clientApp: state.api.clientApp,
  });
  const hasSearchParams = Object.values(filters).some((param) => (
    typeof param !== 'undefined' && param.length
  ));
  const stateMatchesLocation = Object.keys(location.query).every((key) => (
    location.query[key] === makeQueryParams(state.search.filters)[key]
  ));

  if (stateMatchesLocation) {
    return { hasSearchParams, filters, ...state.search };
  }

  return { hasSearchParams };
}

export function performSearch({ dispatch, page, api, auth = false, filters }) {
  if (!filters || !Object.values(filters).length) {
    return Promise.resolve();
  }

  dispatch(searchStart({ page, filters }));
  return search({ page, api, auth, filters })
    .then((response) => dispatch(searchLoad({ page, filters, ...response })))
    .catch(() => dispatch(searchFail({ page, filters })));
}

export function isLoaded({ page, state, filters }) {
  const stateMatchesLocation = Object.keys(filters).every((key) => (
    filters[key] === state.filters[key]
  ));
  return stateMatchesLocation && state.page === page && !state.loading;
}

export function parsePage(page) {
  const parsed = parseInt(page, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

export function loadSearchResultsIfNeeded({ store: { dispatch, getState }, location }) {
  const page = parsePage(location.query.page);
  const state = getState();
  const filters = makeFilters({
    ...location.query,
    clientApp: state.api.clientApp,
  });
  if (!isLoaded({ state: state.search, page, filters })) {
    return performSearch({ dispatch, page, api: state.api, auth: state.auth, filters });
  }
  return true;
}

// export default function createSearchPage(SearchPageComponent) {
//   return asyncConnect([{
//     deferred: true,
//     promise: loadSearchResultsIfNeeded,
//   }])(connect(mapStateToProps)(SearchPageComponent));
// }
