import { createColumnHelper, Row } from "@tanstack/react-table";
import { Button, Tooltip, OverlayTrigger, Badge } from "react-bootstrap";
import { BsPencilFill, BsPersonXFill } from "react-icons/bs";
import { MdContentCopy, MdDelete } from "react-icons/md";
import { ICourseResponse as ICourse } from "../../utils/interfaces";

/**
 * @author Suraj Raghu Kumar on October 27, 2023
 * 
 */

// Course Columns Configuration
type Fn = (row: Row<ICourse>) => void;

const columnHelper = createColumnHelper<ICourse>();

export const courseColumns = (handleEdit: Fn, handleDelete: Fn, handleTA: Fn, handleCopy: Fn, handleShowDetails:(course: ICourse) => void) => [
  // Column for the course name
  columnHelper.accessor("name", {
    id: "name",
    header: "Name",
    cell: (info) => <a href="#" onClick={() => handleShowDetails(info.row.original)}>{info.getValue()}</a>,
    enableSorting: true,
    enableColumnFilter: true,
    enableGlobalFilter: false
  }),
  // Column for the institution name
  columnHelper.accessor("institution.name", {
    id: "institution",
    header: () => <span style={{ fontWeight: 'bold' }}>Institution</span>,
    enableSorting: true,
    enableMultiSort: true,
    enableGlobalFilter: false,
    cell: info => <span>{info.getValue() || <Badge bg="secondary">N/A</Badge>}</span>
  }),

  // Column for the instructor name
  columnHelper.accessor("instructor.name", {
    id: "instructor",
    header: () => <span style={{ fontWeight: 'bold' }}>Instructor Name</span>,
    enableSorting: true,
    enableColumnFilter: true,
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const instructor = row.original.instructor;
      return (
        <span>
          {instructor && instructor.name ? (
            instructor.name
          ) : (
            <Badge bg="danger">No Instructor Assigned</Badge>
          )}
        </span>
      );
    },
  }),

  // Column for the creation date
  columnHelper.accessor("created_at", {
    header: () => <span style={{ fontWeight: 'bold' }}>Creation Date</span>,
    enableSorting: true,
    enableColumnFilter: true,
    enableGlobalFilter: true,
    cell: info => <span>{new Date(info.getValue()).toLocaleDateString() || <Badge bg="secondary">N/A</Badge>}</span>
  }),

  // Column for the last updated date
  columnHelper.accessor("updated_at", {
    header: () => <span style={{ fontWeight: 'bold' }}>Updated Date</span>,
    enableSorting: true,
    enableColumnFilter: true,
    enableGlobalFilter: true,
    cell: info => <span>{new Date(info.getValue()).toLocaleDateString() || <Badge bg="secondary">N/A</Badge>}</span>
  }),

  // Actions column with edit, delete, TA, and copy buttons
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="d-flex">
        <OverlayTrigger overlay={<Tooltip>Edit Course</Tooltip>}>
          <Button variant="outline-warning" size="sm" onClick={() => handleEdit(row)} className="me-1" aria-label="Edit Course">
            <BsPencilFill />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip>Delete Course</Tooltip>}>
          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(row)} className="me-1" aria-label="Delete Course">
            <MdDelete />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip>Assign TA</Tooltip>}>
          <Button variant="outline-info" size="sm" onClick={() => handleTA(row)} className="me-1" aria-label="Assign TA">
            <BsPersonXFill />
          </Button>
        </OverlayTrigger>
        <OverlayTrigger overlay={<Tooltip>Copy Course</Tooltip>}>
          <Button variant="outline-primary" size="sm" onClick={() => handleCopy(row)} aria-label="Copy Course">
            <MdContentCopy />
          </Button>
        </OverlayTrigger>
      </div>
    ),
  }),
];
