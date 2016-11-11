import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

import { search } from 'core/api';
import { searchStart, searchLoad, searchFail } from 'core/actions/search';

export function mapStateToProps(state, ownProps) {
  const { location } = ownProps;
  const filters = {
    addonType: location.query.type,
    category: location.query.category,
    query: location.query.q,
  }
  const hasSearchParams = Object.values(filters).some((param) => (
    typeof param !== 'undefined' && param.length
  ));
  // const searchParamsMatchState = Object.values(filters).some((param) => (
  //   typeof param !== 'undefined' && param.length
  // ));

  if (location.query.q === state.search.query) {
    return { filters, hasSearchParams, ...state.search };
  }
  return { filters, hasSearchParams };
}

function performSearch({ dispatch, page, api, auth = false, filters }) {
  if (!filters || !Object.values(filters).length) {
    return Promise.resolve();
  }
  dispatch(searchStart({ page, filters }));
  return search({ page, api, auth, filters })
    .then((response) => dispatch(searchLoad({ page, filters, ...response })))
    .catch(() => dispatch(searchFail({ page, filters })));
}

export function isLoaded({ page, state, filters }) {
  // return Object.keys(state.filters) === filters.query && state.page === page && !state.loading;
  return !state.loading;
}

export function parsePage(page) {
  const parsed = parseInt(page, 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

export function loadSearchResultsIfNeeded({ store: { dispatch, getState }, location }) {
  const page = parsePage(location.query.page);
  const state = getState();
  const filters = state.filters;
  if (!isLoaded({ state: state.search, page, filters })) {
    return performSearch({ dispatch, page, api: state.api, auth: state.auth, filters });
  }
  return true;
}

export default function createSearchPage(SearchPageComponent) {
  return asyncConnect([{
    deferred: true,
    promise: loadSearchResultsIfNeeded,
  }])(connect(mapStateToProps)(SearchPageComponent));
}
