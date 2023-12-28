interface fetchType {
  currentPage: number;
  per_page: number;
  sortFilter: SortType;
  stateFilter: StateType;
}
type StateType =
  | { text: "전체"; value: "all" }
  | { text: "open"; value: "open" }
  | { text: "closed"; value: "closed" };

type SortType =
  | { text: "작성일 순"; value: "created" }
  | { text: "수정일 순"; value: "updated" }
  | { text: "코멘트 순"; value: "comments" };

const fetchIssues = async ({
  currentPage,
  per_page,
  sortFilter,
  stateFilter,
}: fetchType) => {
  const response = await fetch(
    `https://api.github.com/repos/facebook/react/issues?page=${currentPage}&per_page=${per_page}&sort=${sortFilter.value}&state=${stateFilter.value}`
  );
  return await response;
};

export default fetchIssues;
