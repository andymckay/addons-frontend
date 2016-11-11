import React, { PropTypes } from 'react';

import Link from 'amo/components/Link';
import Paginate from 'core/components/Paginate';
import SearchResults from 'core/components/Search/SearchResults';

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
      LinkComponent, ResultComponent, count, filters, loading, page, results,
    } = this.props;
    const paginator = filters.query && filters.count > 0 ?
      <Paginate LinkComponent={LinkComponent} count={count} currentPage={page}
        pathname="/search/" query={{ q: filters.query }} showPages={0} /> : [];

    return (
      <div className="search-page">
        <SearchResults ResultComponent={ResultComponent} count={count}
          loading={loading} results={results} {...filters} />
        {paginator}
      </div>
    );
  }
}
