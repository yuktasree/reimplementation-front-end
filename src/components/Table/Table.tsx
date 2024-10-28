import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {Col, Container, Row, Table as BTable} from "react-bootstrap";
import ColumnFilter from "./ColumnFilter";
import GlobalFilter from "./GlobalFilter";
import Pagination from "./Pagination";
import RowSelectCheckBox from "./RowSelectCheckBox";

/**
 * @author Ankur Mundra on May, 2023
 */

interface TableProps {
  data: Record<string, any>[];
  columns: ColumnDef<any, any>[];
  showGlobalFilter?: boolean;
  showColumnFilter?: boolean;
  showPagination?: boolean;
  tableSize?: { span: number; offset: number };
  columnVisibility?: Record<string, boolean>;
  onSelectionChange?: (selectedData: Record<any, any>[]) => void;
}

const Table: React.FC<TableProps> = ({
  data: initialData,
  columns,
  showGlobalFilter = true,
  showColumnFilter = true,
  showPagination = true,
  onSelectionChange,
  columnVisibility = {},
  tableSize = { span: 12, offset: 0 },
}) => {
  const colsPlusSelectable = useMemo(() => {
    const selectableColumn: any = {
      id: "select",
      header: ({ table }: any) => {
        return (
          <RowSelectCheckBox
            {...{ 
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        );
      },
      cell: ({ row }: any) => {
        return (
          <RowSelectCheckBox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        );
      },
      enableSorting: false,
      enableFilter: false,
    };
    return [selectableColumn, ...columns];
  }, [columns]);

  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string | number>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibilityState, setColumnVisibilityState] = useState(columnVisibility);

  const selectable = typeof onSelectionChange === "function";
  const onSelectionChangeRef = useRef<any>(onSelectionChange);

  const table = useReactTable({
    data: initialData,
    columns: selectable ? colsPlusSelectable : columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
      columnVisibility: columnVisibilityState,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibilityState,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const {
    getState,
    getHeaderGroups,
    getRowModel,
    getCanNextPage,
    getCanPreviousPage,
    previousPage,
    nextPage,
    setPageIndex,
    setPageSize,
    getPageCount,
  } = table;

  // Used to return early from useEffect() on mount.
  const firstRenderRef = useRef(true);
  // This useEffect() watches flatRows such that on change it
  // calls the onSelectionChange() prop. Technically, it calls
  // the onSelectionChangeRef.current function if it exists.

  const flatRows = table.getSelectedRowModel().flatRows;

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (typeof onSelectionChangeRef.current !== "function") {
      return;
    }
    const selectedData = flatRows.map((flatRow) => flatRow.original);
    const handleSelectionChange = onSelectionChangeRef.current;
    handleSelectionChange?.(selectedData);
  }, [flatRows]);

  return (
    <Container>
      {showGlobalFilter && (
        <Row className="mb-md-2">
          <Col md={{ span: 4, offset: 4 }}>
            <GlobalFilter filterValue={globalFilter} setFilterValue={setGlobalFilter} />{" "}
          </Col>
        </Row>
      )}
      <Row>
        <Col md={tableSize}>
          <BTable striped hover responsive size="sm">
            <thead className="table-secondary">
              {getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? "cursor-pointer select-none"
                                  : "",
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                            {showColumnFilter && header.column.getCanFilter() ? (
                              <ColumnFilter column={header.column} />
                            ) : null}
                          </>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </BTable>
          {showPagination && (
            <Pagination
              nextPage={nextPage}
              previousPage={previousPage}
              canNextPage={getCanNextPage}
              canPreviousPage={getCanPreviousPage}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              getPageCount={getPageCount}
              getState={getState}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Table;
