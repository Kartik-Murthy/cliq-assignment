"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRef, useState } from "react";

type PaginationProps = {
  totalItems: number;
  onPageChange?: (page: number, pageSize: number) => void;
};

const Pagination = ({ totalItems, onPageChange }: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("1");
  const [pageSize, setPageSize] = useState(50);

  const inputRef = useRef<HTMLInputElement>(null);

  const numPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, numPages));
    setCurrentPage(newPage);
    setInputValue(newPage.toString());
    onPageChange?.(newPage, pageSize);
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    setInputValue("1");
    onPageChange?.(1, newSize);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlurOrEnter = () => {
    inputRef?.current?.blur();
    const val = parseInt(inputValue, 10);
    if (!isNaN(val)) {
      goToPage(val);
    } else {
      // Revert to last valid page if input is empty or invalid
      setInputValue(currentPage.toString());
    }
  };

  return (
    <div className="flex w-[220px] items-center justify-end gap-2 text-sm whitespace-nowrap text-black">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft size={18} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
      </Button>

      <div className="flex min-w-[70px] items-center space-x-1">
        <Input
          type="text"
          ref={inputRef}
          className="h-8 w-10 min-w-10 px-2 text-center text-sm"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlurOrEnter}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleInputBlurOrEnter();
          }}
        />
        <span className="text-sm">of {numPages}</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === numPages}
      >
        <ChevronRight size={18} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => goToPage(numPages)}
        disabled={currentPage === numPages}
      >
        <ChevronsRight size={18} />
      </Button>

      <div className="ml-4 flex max-w-[120px] min-w-[120px] items-center space-x-1">
        <span>Show:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
        >
          <SelectTrigger className="h-8 max-w-[80px] min-w-[80px] justify-between truncate bg-white text-sm text-black">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[10, 25, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Pagination;
