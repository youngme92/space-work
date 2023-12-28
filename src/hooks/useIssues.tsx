import { useEffect, useState } from "react";
import fetchIssues from "../fetch/fetchIssues";

type Issue = {
  id: number;
  title: string;
  comments: number;
  updated_at: string;
  created_at: string;
  user: User;
};
type User = {
  login: string;
};

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

export const useIssues = ({
  currentPage,
  per_page,
  sortFilter,
  stateFilter,
}: fetchType) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchIssues({ currentPage, per_page, sortFilter, stateFilter }).then(
      async (issues) => {
        if (issues.ok) {
          const data = await issues.json();
          setIssues(data);

          const linkHeader = issues.headers.get("link");
          if (linkHeader) {
            const regex = new RegExp(
              `page=(\\d+)&per_page=${per_page}&sort=${sortFilter.value}&state=${stateFilter.value}>; rel="last"`
            );
            const match = linkHeader.match(regex);
            if (match) {
              const lastPage = parseInt(match[1]);
              setTotalPages(lastPage);
            }
          }
        }
      }
    );
  }, [currentPage, sortFilter, stateFilter]);

  return { issues, totalPages };
};

export default useIssues;
