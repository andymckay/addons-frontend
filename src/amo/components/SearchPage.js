import React, { PropTypes } from 'react';

import Link from 'amo/components/Link';
import Paginate from 'core/components/Paginate';
import SearchResults from 'core/components/Search/SearchResults';
import { makeQueryParams } from 'core/containers/SearchPage';

import SearchResult from './SearchResult';


export default class SearchPage extends React.Component {
  static propTypes = {
    LinkComponent: PropTypes.node.isRequired,
    ResultComponent: PropTypes.node.isRequired,
    count: PropTypes.number,
    filters: PropTypes.object,
    hasSearchParams: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    page: PropTypes.number,
    results: PropTypes.array,
  }

  static defaultProps = {
    LinkComponent: Link,
    ResultComponent: SearchResult,
    filters: {},
  }

  render() {
    const {
      LinkComponent, ResultComponent, count, filters, hasSearchParams,
      loading, page, results,
    } = this.props;
    console.log('mqp', filters, makeQueryParams(filters));
    const paginator = count && hasSearchParams > 0 ?
      <Paginate LinkComponent={LinkComponent} count={count} currentPage={page}
        filters={makeQueryParams(filters)} pathname="/search/"
        showPages={0} /> : [];

    return (
      <div className="search-page">
        <SearchResults ResultComponent={ResultComponent} count={count}
          hasSearchParams={hasSearchParams} loading={loading} results={results}
          filters={filters} />
        {paginator}
      </div>
    );
  }
}
