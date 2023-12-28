import React, { useState } from "react";
import style from "./issuePage.module.scss";
import useIssues from "../hooks/useIssues";
import dateformatter from "../utils/DateFormatter";
import useDialog from "../hooks/useDialog";

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

type IssuesContextType = {
  issues: Array<Issue>;
  groupSize: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
} | null;

type StateType =
  | { text: "전체"; value: "all" }
  | { text: "open"; value: "open" }
  | { text: "closed"; value: "closed" };

type SortType =
  | { text: "작성일 순"; value: "created" }
  | { text: "수정일 순"; value: "updated" }
  | { text: "코멘트 순"; value: "comments" };

const stateList = [
  { text: "전체", value: "all" },
  { text: "open", value: "open" },
  { text: "closed", value: "closed" },
];
const sortList = [
  { text: "작성일 순", value: "created" },
  { text: "수정일 순", value: "updated" },
  { text: "코멘트 순", value: "comments" },
];
const IssuesContext = React.createContext<IssuesContextType>(null);
const PER_PAGE = 10;

const IssuePage = () => {
  const groupSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [stateFilter, setStateFilter] = useState<StateType>({
    text: "open",
    value: "open",
  });
  const [sortFilter, setSortFilter] = useState<SortType>({
    text: "작성일 순",
    value: "created",
  });
  // const [showDialog, setShowDialog] = useState(false);
  const { issues, totalPages } = useIssues({
    currentPage,
    stateFilter,
    sortFilter,
    per_page: PER_PAGE,
  });
  const stateFilterDialog = useDialog();
  const sortFilterDialog = useDialog();
  return (
    <IssuesContext.Provider
      value={{
        issues,
        groupSize,
        totalPages,
        currentPage,
        setCurrentPage,
      }}
    >
      <div className={style.issueContainer}>
        <div className={style.title__container}>
          <div className={style.divider}></div>
          <div className={style.title}>
            <h1>이슈 정리</h1>
          </div>
        </div>
        <div className={style.filters}>
          <IssuePage.StateFilter
            stateFilter={stateFilter}
            stateFilterDialog={stateFilterDialog}
            setStateFilter={setStateFilter}
          />
          <IssuePage.SortFilter
            sortFilter={sortFilter}
            sortFilterDialog={sortFilterDialog}
            setSortFilter={setSortFilter}
          />
        </div>
        <IssuePage.IssueTable />
        <IssuePage.PageNation />
      </div>
    </IssuesContext.Provider>
  );
};

const StateFilter = ({ stateFilter, stateFilterDialog, setStateFilter }) => {
  const { isOpen, dialogRef, handleDialog } = stateFilterDialog;
  return (
    <>
      <div className={style.stateFilter} onClick={() => handleDialog(!isOpen)}>
        {stateFilter.text}
        <span className={style.dropdown_icon}></span>
      </div>
      {isOpen && (
        <StateDialog
          stateFilter={stateFilter}
          dialogRef={dialogRef}
          setStateFilter={setStateFilter}
          isOpen={isOpen}
          handleDialog={handleDialog}
        />
      )}
    </>
  );
};

const SortFilter = ({ sortFilter, sortFilterDialog, setSortFilter }) => {
  const { isOpen, dialogRef, handleDialog } = sortFilterDialog;
  return (
    <>
      <div className={style.SortFilter} onClick={() => handleDialog(!isOpen)}>
        {sortFilter.text}
        <span className={style.dropdown_icon}></span>
      </div>

      {isOpen && (
        <SortDialog
          sortFilter={sortFilter}
          dialogRef={dialogRef}
          setSortFilter={setSortFilter}
        />
      )}
    </>
  );
};

const IssueTable = () => {
  const Issuecontext = React.useContext(IssuesContext);
  if (Issuecontext) {
    const { issues, currentPage } = Issuecontext;
    const startIndex = (currentPage - 1) * PER_PAGE;
    return (
      <table className={style.issueTable}>
        <thead>
          <tr>
            <th>번호</th>
            <th>타이틀</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>수정일</th>
            <th>코멘트 수</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue: Issue, index: number) => (
            <tr key={issue.id}>
              <td>{startIndex + index + 1}</td>
              <td>{issue.title}</td>
              <td>{issue.user.login}</td>
              <td>{dateformatter(issue.created_at)}</td>
              <td>{dateformatter(issue.updated_at)}</td>
              <td>{issue.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else return null;
};

const PageNation = () => {
  const Issuecontext = React.useContext(IssuesContext);
  if (Issuecontext) {
    const { groupSize, totalPages, currentPage, setCurrentPage } = Issuecontext;
    const renderPagination = () => {
      const pagination = [];
      // 시작 페이지 계산
      const startPage =
        Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
      // 끝 페이지 계산
      const endPage = Math.min(startPage + groupSize - 1, totalPages);

      for (let i = startPage; i <= endPage; i++) {
        pagination.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`${currentPage === i ? style.active : ""} ${style.pagi}`}
          >
            <div>{i}</div>
          </button>
        );
      }
      return pagination;
    };
    return (
      <div className={style.pagiNation}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className={style.left_arrow_icon}></span>
        </button>
        {renderPagination()}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className={style.right_arrow_icon}></span>
        </button>
      </div>
    );
  } else return null;
};

const SortDialog = ({ sortFilter, dialogRef, setSortFilter }) => {
  return (
    <div className={style.sortDialog} ref={dialogRef}>
      <div className={style.sortDialogTitle}>
        <p>정렬</p>
      </div>
      <div className={style.sortList}>
        {sortList.map((item, index) => (
          <div key={index} onClick={() => setSortFilter(item)}>
            <span>{item.text}</span>
            {sortFilter.value === item.value ? (
              <span className={style.checkmark}></span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
const StateDialog = ({
  stateFilter,
  dialogRef,
  setStateFilter,
  isOpen,
  handleDialog,
}) => {
  const [Filter, setFilter] = useState(stateFilter);
  const handleClickApplyButton = () => {
    setStateFilter(Filter);
    handleDialog(!isOpen);
  };
  return (
    <div className={style.stateDialog} ref={dialogRef}>
      <div className={style.stateDialogTitle}>
        <p>이슈 상태</p>
      </div>
      <div className={style.stateList}>
        {stateList.map((item, index) => (
          <button
            key={index}
            className={item.value === Filter.value ? style.active : ""}
            onClick={() => setFilter(item)}
          >
            {item.text}
          </button>
        ))}
      </div>
      <div
        className={style.applyButton}
        onClick={() => handleClickApplyButton()}
      >
        <button>적용</button>
      </div>
    </div>
  );
};

IssuePage.StateFilter = StateFilter;
IssuePage.SortFilter = SortFilter;
IssuePage.PageNation = PageNation;
IssuePage.IssueTable = IssueTable;

export default IssuePage;
