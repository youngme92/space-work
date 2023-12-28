import { useState, useEffect, useRef } from "react";

// useDialog 커스텀 훅 정의
const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleDialog = (value: boolean) => {
    if (value) {
      openDialog();
    } else {
      closeDialog();
    }
  };

  // 다이얼로그 열기
  const openDialog = () => {
    setIsOpen(true);
  };

  // 다이얼로그 닫기
  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node)
    ) {
      closeDialog();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return {
    isOpen,
    dialogRef,
    openDialog,
    closeDialog,
    handleDialog,
  };
};

export default useDialog;
